from datetime import datetime
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mail import Mail, Message
import mysql.connector
import json
import random
import re
import requests

def ask_lyzr(message):

    url = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/"

    headers = {
        "Content-Type": "application/json",
        "x-api-key": os.getenv("LYZR_API_KEY")
    }

    payload = {
        "user_id": "eventhub_user",
        "agent_id": os.getenv("LYZR_AGENT_ID_EVENTS"),
        "session_id": "eventhub_session",
        "message": message
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    print("STATUS =", response.status_code)
    print("RESPONSE TEXT =", response.text)

    return response.json()

print(requests.__version__)
load_dotenv()

def get_db():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password=os.getenv("MYSQL_DB_PASSWORD"),
        database="eventhub"
    )

print("MySQL Connected Successfully")

app = Flask(__name__)
CORS(app)
generated_otp = ""
booking_sessions = {}

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("EMAIL_USER")
app.config["MAIL_PASSWORD"] = os.getenv("EMAIL_PASSWORD")

mail = Mail(app)

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    phone = data["phone"]
    city = data["city"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email=%s",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 400

    cursor.execute(
        """
        INSERT INTO users
        (name,email,password,phone,city)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (
        name,
        email,
        password,
        phone,
        city
        )
    )

    db.commit()

    return jsonify({
        "message": "Registration Successful",
        "user": {
            "id": cursor.lastrowid,
            "name": name,
            "email": email,
            "phone": phone,
            "city": city
        }
    })

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT
        id,
        name,
        email,
        phone,
        city
        FROM users
        WHERE email=%s
        AND password=%s
        """,
        (email, password)
    )

    user = cursor.fetchone()

    if not user:
        return jsonify({
            "message": "Invalid Email or Password"
        }), 401

    return jsonify({
        "message": "Login Successful",
        "user": {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "phone": user[3],
            "city": user[4]
        }
    })

@app.route("/events")
def get_events():

    with open("data/events.json", "r") as file:
        events = json.load(file)

    return jsonify(events)

@app.route("/events/<int:event_id>")
def get_event(event_id):

    with open("data/events.json", "r") as file:
        events = json.load(file)

    for event in events:
        if event["id"] == event_id:
            return jsonify(event)

    return jsonify({"message": "Event not found"}), 404

@app.route("/book-event", methods=["POST"])
def book_event():

    data = request.json

    booking_id = data["booking_id"]
    user_id = data["user_id"]
    event_id = data["event_id"]
    seats = data["seats"]
    total_amount = data["total_amount"]

    event_name = data["event_name"]
    event_image = data["event_image"]
    event_venue = data["event_venue"]
    selected_date = data["selected_date"]
    selected_time = data["selected_time"]
   
    db = get_db()
    cursor = db.cursor()

    cursor.execute(
    """
    INSERT INTO bookings
    (
        booking_id,
        user_id,
        event_id,
        seats,
        total_amount,
        payment_status,
        status,
        event_name,
        event_image,
        event_venue,
        selected_date,
        selected_time
    )
    VALUES
    (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """,
    (
        booking_id,
        user_id,
        event_id,
        ",".join(seats),
        total_amount,
        "Paid",
        "Confirmed",
        event_name,
        event_image,
        event_venue,
        selected_date,
        selected_time
    )
)

    db.commit()

    return jsonify({
        "message": "Booking Saved Successfully"
    })

@app.route("/my-bookings/<int:user_id>")
def my_bookings(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM bookings
        WHERE user_id=%s
        ORDER BY booking_date DESC
        """,
        (user_id,)
    )

    bookings = cursor.fetchall()

    return jsonify(bookings)

@app.route("/cancel-booking/<booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "DELETE FROM bookings WHERE booking_id=%s",
        (booking_id,)
    )

    db.commit()

    return jsonify({
        "message": "Booking Cancelled Successfully"
    })
@app.route("/profile/<int:user_id>")
def profile(user_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            name,
            email,
            phone,
            city,
            profile_image
        FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    cursor.execute(
        """
        SELECT
            COUNT(*) AS total_bookings,
            COALESCE(SUM(total_amount),0)
            AS total_spent
        FROM bookings
        WHERE user_id=%s
        """,
        (user_id,)
    )

    stats = cursor.fetchone()

    return jsonify({
        "user": user,
        "stats": stats
    })

@app.route("/update-profile/<int:user_id>", methods=["PUT"])
def update_profile(user_id):

    data = request.json

    phone = data["phone"]
    city = data["city"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE users
        SET phone=%s,
            city=%s
        WHERE id=%s
        """,
        (phone, city, user_id)
    )

    db.commit()

    return jsonify({
        "message": "Profile Updated Successfully"
    })

@app.route("/rate-event", methods=["POST"])
def rate_event():

    data = request.json

    print("Received Data:")
    print(data)

    user_id = data["user_id"]
    event_id = data["event_id"]
    rating = data["rating"]
    review = data["review"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT *
        FROM ratings
        WHERE user_id=%s
        AND event_id=%s
        """,
        (user_id, event_id)
    )

    existing = cursor.fetchone()

    if existing:
        return jsonify({
            "message":
            "You already reviewed this event"
        }), 400

    cursor.execute(
        """
        INSERT INTO ratings
        (user_id,event_id,rating,review)
        VALUES (%s,%s,%s,%s)
        """,
        (
            user_id,
            event_id,
            rating,
            review
        )
    )

    db.commit()

    return jsonify({
        "message":
        "Review Submitted Successfully"
    })

@app.route("/event-rating/<int:event_id>")
def event_rating(event_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            ROUND(AVG(rating),1)
            AS average_rating,
            COUNT(*) AS total_reviews
        FROM ratings
        WHERE event_id=%s
        """,
        (event_id,)
    )

    result = cursor.fetchone()

    return jsonify(result)

@app.route("/event-reviews/<int:event_id>")
def event_reviews(event_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            users.name,
            ratings.rating,
            ratings.review
        FROM ratings
        JOIN users
        ON ratings.user_id = users.id
        WHERE event_id=%s
        ORDER BY ratings.id DESC
        """,
        (event_id,)
    )

    reviews = cursor.fetchall()

    return jsonify(reviews)
    
@app.route("/send-otp", methods=["POST"])
def send_otp():

    data = request.json
    email = data["email"]

    global generated_otp

    generated_otp = str(
        random.randint(100000, 999999)
    )

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO otp_verification
        (email, otp)
        VALUES (%s,%s)
        """,
        (email, generated_otp)
    )

    db.commit()

    msg = Message(
        "EventHub OTP Verification",
        sender=os.getenv("EMAIL_USER"),
        recipients=[email]
    )

    msg.body = f"""
Your EventHub OTP is:

{generated_otp}

Valid for registration verification.
"""

    mail.send(msg)

    return jsonify({
        "message": "OTP Sent Successfully"
    })


@app.route("/verify-otp", methods=["POST"])
def verify_otp():

    data = request.json

    email = data["email"]
    entered_otp = data["otp"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT otp
        FROM otp_verification
        WHERE email=%s
        ORDER BY id DESC
        LIMIT 1
        """,
        (email,)
    )

    result = cursor.fetchone()

    if not result:
        return jsonify({
            "success": False,
            "message": "OTP not found"
        }), 400

    saved_otp = result[0]

    if entered_otp == saved_otp:

        return jsonify({
            "success": True,
            "message": "OTP Verified Successfully"
        })

    return jsonify({
        "success": False,
        "message": "Invalid OTP"
    }), 400

@app.route("/search-events")
def search_events():

    category = request.args.get("category")
    city = request.args.get("city")
    date = request.args.get("date")
    time = request.args.get("time")

    with open("data/events.json", "r") as file:
        events = json.load(file)

    results = []

    for event in events:

        venue_match = (
            city.lower() in event["venue"].lower()
            if city else True
        )

        category_match = (
            category.lower() in event["category"].lower()
            if category else True
        )

        date_match = False
        time_match = False

        for schedule in event["schedules"]:

            if date and schedule["date"] == date:
                date_match = True

                if time:
                    if time in schedule["time_slots"]:
                        time_match = True

        if venue_match and category_match:

            if date:
                if not date_match:
                    continue

            if time:
                if not time_match:
                    continue

            results.append(event)

    return jsonify(results)

@app.route("/recommend-events/<int:event_id>")
def recommend_events(event_id):

    with open("data/events.json", "r") as file:
        events = json.load(file)

    current_event = next(
        (
            e for e in events
            if e["id"] == event_id
        ),
        None
    )

    if not current_event:
        return jsonify([])

    category = current_event["category"]

    recommendations = [
        e for e in events
        if e["id"] != event_id
        and e["category"] == category
    ]

    return jsonify(recommendations[:3])

@app.route("/user-booking-history/<int:user_id>")
def user_booking_history(user_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT event_name
        FROM bookings
        WHERE user_id=%s
        ORDER BY booking_date DESC
    """, (user_id,))

    rows = cursor.fetchall()

    history = [row[0] for row in rows]

    cursor.close()
    db.close()

    return jsonify(history)

@app.route("/ai-recommendations/<int:user_id>")
def ai_recommendations(user_id):

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT event_name
        FROM bookings
        WHERE user_id=%s
        ORDER BY booking_date DESC
    """, (user_id,))

    rows = cursor.fetchall()

    history = list(set([row[0] for row in rows]))

    cursor.close()
    db.close()

    with open("data/events.json", "r") as file:
        events = json.load(file)

    history_text = ", ".join(history)

    prompt = f"""
User booked these events:

{history_text}

Available events:

{json.dumps(events)}

Recommend 5 events that match the user's interests.

Return ONLY event names separated by commas.
"""

    lyzr_response = ask_lyzr(prompt)

    return jsonify({
        "recommendations": lyzr_response,
        "events": events
    })

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    message = data["message"].lower().strip()
    print("SESSION =", booking_sessions)
    print("MESSAGE =", message)

    with open("data/events.json", "r") as file:
        events = json.load(file)

    # -----------------------------
    # EXISTING BOOKING SESSION
    # -----------------------------
    if "current" in booking_sessions:

        current_booking = booking_sessions["current"]

        month_date_match = re.search(
            r"(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})",
            message
        )

        if current_booking["date"] is None:

            if month_date_match:

                month_name = month_date_match.group(1)
                day = int(month_date_match.group(2))

                month_number = datetime.strptime(
                    month_name,
                    "%B"
                ).month

                current_year = datetime.now().year

                current_booking["date"] = (
                    f"{current_year}-{month_number:02d}-{day:02d}"
                )

            elif re.match(r"\d{4}-\d{2}-\d{2}", message):

                current_booking["date"] = message

        # -----------------------------
        # AUTO EXTRACT TICKETS
        # -----------------------------
        if current_booking["tickets"] is None:

            ticket_match = re.search(
                r"(\d+)\s*(ticket|tickets)?",
                message
            )

            if ticket_match:

                number = int(
                    ticket_match.group(1)
                )

                # Avoid treating dates as ticket count
                if number <= 20:

                    current_booking["tickets"] = number

        # Auto extract date
        date_match = re.search(
            r"\d{4}-\d{2}-\d{2}",
            message
        )

        if date_match:

            current_booking["date"] = date_match.group()

        # Auto extract time
        time_match = re.search(
            r"\d{1,2}(:\d{2})?\s?(am|pm)",
            message
        )

        if time_match:

            current_booking["time"] = (
                time_match.group()
            )

        # -----------------------------
        # ASK TICKETS
        # -----------------------------
        if current_booking["tickets"] is None:

            return jsonify({
                "reply":
                "Please enter the number of tickets."
            })

        # -----------------------------
        # ASK DATE
        # -----------------------------
        elif current_booking["date"] is None:

            dates = [
                schedule["date"]
                for schedule in current_booking["event"]["schedules"]
            ]

            return jsonify({
                "reply":
                "Available Dates:\n\n"
                + "\n".join(dates)
            })

        # -----------------------------
        # ASK TIME
        # -----------------------------
        elif current_booking["time"] is None:

            available_times = []

            for schedule in current_booking["event"]["schedules"]:

                if schedule["date"] == current_booking["date"]:

                    available_times = schedule["time_slots"]
                    break

            return jsonify({
                "reply":
                "Available Time Slots:\n\n"
                + "\n".join(available_times)
            })

        # -----------------------------
        # SHOW SUMMARY
        # -----------------------------

        valid = False

        selected_time = (
            current_booking["time"]
            .strip()
            .upper()
        )

        for schedule in current_booking["event"]["schedules"]:

            if schedule["date"] == current_booking["date"]:

                for slot in schedule["time_slots"]:

                    if slot.strip().upper() == selected_time:

                        valid = True
                        break

                    print("DATE =", current_booking["date"])
                    print("TIME =", current_booking["time"])
                    print("VALID =", valid)

        if not valid:

            available_slots = []

            for schedule in current_booking["event"]["schedules"]:

                if schedule["date"] == current_booking["date"]:

                    available_slots = schedule["time_slots"]
                    break

            return jsonify({
                "reply":
                f"""
Selected time is not available.

Available slots for {current_booking['date']}:

{chr(10).join(available_slots)}
"""
            })

        elif current_booking["confirmed"] is False:

            confirmation_words = [
                "yes",
                "confirm",
                "confirmed",
                "proceed",
                "continue booking"
            ]

            if any(word in message for word in confirmation_words):

                current_booking["confirmed"] = True

                return jsonify({
                    "reply":
                    """
Choose Seat Preference

1. Front
2. Middle
3. Back
"""
                })

            return jsonify({
                "reply":
                f"""
Booking Summary

🎫 Event: {current_booking['event']['name']}
👥 Tickets: {current_booking['tickets']}
📅 Date: {current_booking['date']}
⏰ Time: {current_booking['time']}

Reply YES to confirm booking.
"""
            })

        # -----------------------------
        # SEAT PREFERENCE
        # -----------------------------
        elif current_booking["seat_preference"] is None:

            print("SEAT MESSAGE =", message)

            seat = None

            if (
                "front" in message
                or "seat preference: front" in message
                or "(option 1)" in message
                or message == "1"
            ):
                seat = "front"

            elif (
                "middle" in message
                or "seat preference: middle" in message
                or "(option 2)" in message
                or message == "2"
            ):
                seat = "middle"

            elif (
                "back" in message
                or "seat preference: back" in message
                or "(option 3)" in message
                or message == "3"
            ):
                seat = "back"

            print("DETECTED SEAT =", seat)

            if seat is None:
                return jsonify({
                    "reply":
                    "Choose Front, Middle or Back."
                })

            current_booking["seat_preference"] = seat

            prefix = (
                "F"
                if seat == "front"
                else "M"
                if seat == "middle"
                else "B"
            )

            start = random.randint(1, 20)

            seats = []

            for i in range(
                current_booking["tickets"]
            ):
                seats.append(
                    f"{prefix}{start+i}"
                )

            current_booking["seats"] = seats

            total_amount = (
                current_booking["event"]["price"]
                * current_booking["tickets"]
            )

            return jsonify({
                "reply":
                f"""
Seat Allocation Completed ✅

🎫 Event:
{current_booking['event']['name']}

👥 Tickets:
{current_booking['tickets']}

💺 Suggested Seats:
{", ".join(seats)}

💰 Ticket Price:
₹{current_booking['event']['price']}

💵 Total Amount:
₹{total_amount}

Click View Seat Map to preview or modify seats.
""",
                "bookingData": {
                    "event": current_booking["event"],
                    "seats": seats,
                    "tickets": current_booking["tickets"],
                    "date": current_booking["date"],
                    "time": current_booking["time"]
                }
            })


    recommendation_keywords = [
        "recommend",
        "suggest",
        "fun",
        "interesting",
        "popular"
    ]

    if any(word in message for word in recommendation_keywords):

        lyzr_response = ask_lyzr(message)

        print("LYZR RESPONSE =", lyzr_response)

        return jsonify({
            "reply": lyzr_response.get(
                "response",
                "Sorry, I couldn't generate recommendations."
            )
        })
    # -----------------------------
    # BOOKING INTENT
    # -----------------------------

    if "book" in message:

        booking_sessions.pop("current", None)

        matched_event = None

        for event in events:
            if event["name"].lower() in message:
                matched_event = event
                break

        if matched_event:

            # Extract tickets
            ticket_match = re.search(
                r"(\d+)\s*(ticket|tickets|member|members)",
                message
            )

            tickets = (
                int(ticket_match.group(1))
                if ticket_match
                else None
            )

            # Extract date
            booking_date = None

            date_match = re.search(
                r"\d{4}-\d{2}-\d{2}",
                message
            )

            if date_match:

                booking_date = date_match.group()

            else:

                month_match = re.search(
                    r"(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})",
                    message
                )

                if month_match:

                    month_name = month_match.group(1)
                    day = int(month_match.group(2))

                    month_number = datetime.strptime(
                        month_name,
                        "%B"
                    ).month

                    current_year = datetime.now().year

                    booking_date = (
                        f"{current_year}-{month_number:02d}-{day:02d}"
                    )

            # Extract time
            time_match = re.search(
                r"\d{1,2}(:\d{2})?\s?(am|pm)",
                message
            )

            booking_time = (
                time_match.group()
                if time_match
                else None
            )

            # Validate date
            available_dates = [
                schedule["date"]
                for schedule in matched_event["schedules"]
            ]

            if booking_date and booking_date not in available_dates:

                booking_sessions["current"] = {
                    "event": matched_event,
                    "tickets": tickets,
                    "date": None,
                    "time": booking_time,
                    "seat_preference": None,
                    "confirmed": False,
                    "seats": None,
                    "seat_confirmed": False
                }

                return jsonify({
                    "reply":
                    f"""
    Requested date is not available.

    Available Dates:

    {chr(10).join(available_dates)}

    Please select one of the above dates.
    """
                })

            booking_sessions["current"] = {
                "event": matched_event,
                "tickets": tickets,
                "date": booking_date,
                "time": booking_time,
                "seat_preference": None,
                "confirmed": False,
                "seats": None,
                "seat_confirmed": False
            }

            # If all details provided
            if tickets and booking_date and booking_time:

                valid = False

                for schedule in matched_event["schedules"]:

                    if schedule["date"] == booking_date:

                        for slot in schedule["time_slots"]:

                            if slot.lower() == booking_time.lower():

                                valid = True
                                break

                if not valid:

                    available_slots = []

                    for schedule in matched_event["schedules"]:

                        if schedule["date"] == booking_date:

                            available_slots = schedule["time_slots"]
                            break

                    return jsonify({
                        "reply":
                        f"""
    Selected time is not available.

    Available slots for {booking_date}:

    {chr(10).join(available_slots)}
    """
                    })

                return jsonify({
                    "reply":
                    f"""
    Booking Summary

    🎫 Event: {matched_event['name']}
    👥 Tickets: {tickets}
    📅 Date: {booking_date}
    ⏰ Time: {booking_time}

    Reply YES to confirm booking.
    """
                })

            return jsonify({
                "reply":
                f"""
    Booking Started ✅

    🎫 Event: {matched_event['name']}
    👥 Tickets: {tickets if tickets else 'Not Provided'}
    📅 Date: {booking_date if booking_date else 'Not Provided'}
    ⏰ Time: {booking_time if booking_time else 'Not Provided'}

    Continue booking...
    """
            })

    # -----------------------------
    # EVENT NAME MATCH
    # -----------------------------

    for event in events:

        if event["name"].lower() in message:

            booking_sessions["current"] = {
                "event": event,
                "tickets": None,
                "date": None,
                "time": None,
                "seat_preference": None,
                "confirmed": False,
                "seats": None,
                "seat_confirmed": False
            }

            return jsonify({
                "reply":
                f"""
    Event Selected ✅

    🎫 {event['name']}
    📂 {event['category']}
    💰 ₹{event['price']}
    📍 {event['venue']}

    How many tickets would you like to book?
    """
            })

    # -----------------------------
    # CATEGORY SEARCH
    # -----------------------------

    matched_events = []

    for event in events:

        if event["category"].lower() in message:
            matched_events.append(event)

    if matched_events:

        reply = "I found these events:\n\n"

        for event in matched_events[:5]:

            reply += (
                f"🎫 {event['name']}\n"
                f"📂 {event['category']}\n"
                f"💰 ₹{event['price']}\n"
                f"📍 {event['venue']}\n"
                f"---------------------\n"
            )

        return jsonify({
            "reply": reply
        })

    return jsonify({
        "reply":
        "Sorry. I couldn't find any matching event."
    })
@app.route("/ai-booking", methods=["POST"])
def ai_booking():

    data = request.json

    event_id = data["event_id"]
    tickets = data["tickets"]
    date = data["date"]
    time = data["time"]
    seat_preference = data["seat_preference"]

    with open("data/events.json", "r") as file:
        events = json.load(file)

    selected_event = None

    for event in events:
        if event["id"] == event_id:
            selected_event = event
            break

    if not selected_event:
        return jsonify({
            "message": "Event not found"
        }), 404

    if seat_preference.lower() == "front":
        prefix = "F"

    elif seat_preference.lower() == "middle":
        prefix = "M"

    else:
        prefix = "B"

    seats = []

    start = random.randint(1, 20)

    for i in range(tickets):
        seats.append(
            f"{prefix}{start+i}"
        )

    total_amount = (
        selected_event["price"] * tickets
    )

    return jsonify({
        "event": selected_event,
        "seats": seats,
        "total_amount": total_amount,
        "date": date,
        "time": time
    })

if __name__ == "__main__":
    app.run(debug=True)