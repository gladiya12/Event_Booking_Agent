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

if __name__ == "__main__":
    app.run(debug=True)