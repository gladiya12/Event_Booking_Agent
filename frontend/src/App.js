import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, []);

  return (
    <div className="container">
      <h1>Event Booking Agent</h1>

      <h2>Top Events</h2>

      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.name}</h3>

            <p>
              <strong>Category:</strong> {event.category}
            </p>

            <p>
              <strong>Date:</strong> {event.date}
            </p>

            <p>
              <strong>Venue:</strong> {event.venue}
            </p>

            <p>
              <strong>Price:</strong> ₹{event.price}
            </p>

            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;