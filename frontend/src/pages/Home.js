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
  const [recommendedEvents, setRecommendedEvents] =
    useState([]);
  const [showTopButton, setShowTopButton] =
  useState(false);

  const [visibleCards, setVisibleCards] = useState(4);

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

  useEffect(() => {

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if (!currentUser) return;

    fetch(
      `http://127.0.0.1:5000/ai-recommendations/${currentUser.id}`
    )
      .then((res) => res.json())
      .then((data) => {

        const names =
          data.recommendations.response
            .split(",")
            .map(item => item.trim());

        fetch("http://127.0.0.1:5000/events")
          .then((res) => res.json())
          .then((allEvents) => {

            const matchedEvents =
              allEvents.filter(event =>
                names.includes(event.name)
              );

            setRecommendedEvents(
              matchedEvents
            );
          });

      })
      .catch(console.error);

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const updateCards = () => {
      const width = window.innerWidth;

      if (width >= 1700) {
        setVisibleCards(5);
      }
      else if (width >= 1300) {
        setVisibleCards(4);
      }
      else if (width >= 1000) {
        setVisibleCards(3);
      }
      else if (width >= 700) {
        setVisibleCards(2);
      }
      else {
        setVisibleCards(1);
      }
    };

    updateCards();

    window.addEventListener(
      "resize",
      updateCards
    );

    return () =>
      window.removeEventListener(
        "resize",
        updateCards
      );
  }, []);

  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        events={events}
      />

      {/* Hero Section */}
      <div
        style={{
          minHeight: "5vh",
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
            fontSize: "clamp(2rem, 4vw, 3rem)",
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
      </div>

{recommendedEvents.length > 0 && (
  <>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "40px 50px 20px"
      }}
    >
      <h1
        style={{
          margin: 0
        }}
      >
        🤖 Recommended For You
      </h1>

      <Link
        to="/events"
        style={{
          color: "#f97316",
          fontWeight: "600",
          textDecoration: "none"
        }}
      >
        See All ›
      </Link>
    </div>

    <div className="event-grid">
      {
        recommendedEvents
          .slice(0, visibleCards)
          .map((event) => (
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
  </>
)}
      {/* Section Title */}
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "40px 50px 20px"
  }}
>
  <h1
    style={{
      fontSize: "42px",
      margin: 0
    }}
  >
    Featured Events
  </h1>

  <Link
    to="/events"
    style={{
      color: "#f97316",
      fontWeight: "600",
      textDecoration: "none"
    }}
  >
    See All ›
  </Link>
</div>
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
          {filteredEvents
            .slice(0, visibleCards)
            .map((event) => (
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
      {showTopButton && (
        <button
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "110px", 
            right: "30px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            zIndex: 9999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          ↑
        </button>
      )}
      <ChatBot />
      <Footer />
      
    </>
  );
}

export default Home;