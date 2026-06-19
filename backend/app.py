import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_mail import Mail, Message
import mysql.connector
import json
import random

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
@app.route("/")
def home():
    return jsonify({
        "message": "Backend Running Successfully"
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

@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    message = data["message"]

    reply = (
        "Welcome to EventHub! "
        "Ask me about events, bookings, venues and tickets."
    )

    return jsonify({
        "reply": reply
    })

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

@app.route("/test-email")
def test_email():

    try:

        msg = Message(
            "EventHub Test Email",
            sender=os.getenv("EMAIL_USER"),
            recipients=[os.getenv("EMAIL_USER")]
        )

        msg.body = "Email service is working successfully."

        mail.send(msg)

        return jsonify({
            "message": "Email Sent Successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
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

if __name__ == "__main__":
    app.run(debug=True)