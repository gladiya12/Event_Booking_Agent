import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px"
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px"
          }}
        >
          🎟 Discover Amazing Events
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "30px"
          }}
        >
          Book workshops, concerts and business meetups easily.
        </p>

        <input
          type="text"
          placeholder="Search Events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "350px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* Category Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "40px"
        }}
      >
        <button onClick={() => setSelectedCategory("All")}>
          All
        </button>

        <button onClick={() => setSelectedCategory("Technology")}>
          Technology
        </button>

        <button onClick={() => setSelectedCategory("Music")}>
          Music
        </button>

        <button onClick={() => setSelectedCategory("Business")}>
          Business
        </button>
      </div>

      <h1 className="heading">Top Events</h1>

      {/* No Events Found */}
      {filteredEvents.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px"
          }}
        >
          <h2>🔍 No Events Found</h2>
          <p>Try another search keyword.</p>
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <div
                key={event.id}
                className="event-card"
            >
                <img
                src={event.image}
                alt={event.name}
                className="event-image"
                />

                <div className="event-content">

                <span className="category-badge">
                    {event.category}
                </span>

                <h3>{event.name}</h3>

                <p>📅 {event.date}</p>

                <p>📍 {event.venue}</p>

                <p className="price">
                    ₹{event.price}
                </p>

                <Link to={`/event/${event.id}`}>
                    <button className="details-btn">
                    View Details
                    </button>
                </Link>

                </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Home;