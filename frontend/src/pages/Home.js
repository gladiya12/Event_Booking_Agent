import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

function Home() {
  const [events, setEvents] = useState([]);
  const [ratings, setRatings] = useState({});
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);

        data.forEach(async (event) => {

          const response = await fetch(
            `http://127.0.0.1:5000/event-rating/${event.id}`
          );

          const ratingData =
            await response.json();

          setRatings(prev => ({
            ...prev,
            [event.id]: ratingData
          }));
        });
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
          minHeight: "50vh",
          background:
            "linear-gradient(135deg,#0f172a,#1e1b4b,#312e81)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 20px",
          color: "white"
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
            fontWeight: "700",
            lineHeight: "1.1",
            maxWidth: "900px",
            marginBottom: "20px"
          }}
        >
          Discover Opportunities to Connect and Grow
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#cbd5e1",
            maxWidth: "700px",
            marginBottom: "30px"
          }}
        >
          Find workshops, concerts and business events
          tailored to your interests.
        </p>

        <input
          type="text"
          placeholder="Search Events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "550px",
            maxWidth: "90%",
            padding: "16px 22px",
            borderRadius: "50px",
            border: "none",
            outline: "none",
            fontSize: "17px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.25)"
          }}
        />
      </div>

      {/* Category Buttons */}
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "40px",
    marginBottom: "50px"
  }}
>
  {[
    "All",
    ...new Set(
      events.map((event) => event.category)
    )
  ].map((category) => (
    <button
      key={category}
      onClick={() =>
        setSelectedCategory(category)
      }
      style={{
        padding: "12px 25px",
        borderRadius: "30px",
        border: "none",
        cursor: "pointer",
        background:
          selectedCategory === category
            ? "#7c3aed"
            : "#1e293b",
        color: "white",
        fontWeight: "600",
        fontSize: "15px"
      }}
    >
      {category}
    </button>
  ))}
</div>

      {/* Section Title */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "50px"
        }}
      >
        Featured Events
      </h1>

      {/* Event Cards */}
      {filteredEvents.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "50px",
            marginBottom: "100px"
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

                <h3
                  style={{
                    marginTop: "15px",
                    fontSize: "24px",
                    minHeight: "60px"
                  }}
                >
                  {event.name}
                </h3>
                <div
                  style={{
                    color: "#f59e0b",
                    fontWeight: "600",
                    marginBottom: "10px"
                  }}
                >
                  ⭐ {
                    ratings[event.id]
                      ?.average_rating || 0
                  }

                  {" "}(
                  {
                    ratings[event.id]
                      ?.total_reviews || 0
                  }
                   Reviews)
                </div>

                <p>📍 {event.venue}</p>

                <p
                  style={{
                    color: "#10b981",
                    fontSize: "24px",
                    fontWeight: "bold"
                  }}
                >
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
      <ChatBot />
      <Footer />
      
    </>
  );
}

export default Home;