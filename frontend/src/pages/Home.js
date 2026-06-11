import { useEffect, useState } from "react";
import "../App.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <nav className="navbar">
        <h2>🎟 Event Booking Agent</h2>
      </nav>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search Events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="categories">
        <button>Technology</button>
        <button>Music</button>
        <button>Business</button>
      </div>

      <h1 className="heading">Top Events</h1>

      <div className="event-grid">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <img src={event.image} alt={event.name} />

            <h3>{event.name}</h3>

            <p>{event.category}</p>

            <p>{event.date}</p>

            <p>{event.venue}</p>

            <p>₹{event.price}</p>

            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;