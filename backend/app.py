from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

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