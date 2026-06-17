from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json

db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Gladiya@mysql08",
    database="eventhub"
)

print("MySQL Connected Successfully")

app = Flask(__name__)
CORS(app)
@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

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
        (name,email,password)
        VALUES (%s,%s,%s)
        """,
        (
            name,
            email,
            password
        )
    )

    db.commit()

    return jsonify({
        "message": "Registration Successful"
    })
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    cursor = db.cursor()

    cursor.execute(
        """
        SELECT id,name,email
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
            "email": user[2]
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

if __name__ == "__main__":
    app.run(debug=True)