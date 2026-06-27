import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Events() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] =
    useState(1);

  const [eventsPerPage, setEventsPerPage] =
    useState(16);

  const [showTopButton, setShowTopButton] =
    useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  useEffect(() => {
    const updatePageSize = () => {

        const width =
        window.innerWidth;

        if (width >= 1600) {
        setEventsPerPage(20);
        }
        else if (width >= 1200) {
        setEventsPerPage(16);
        }
        else if (width >= 768) {
        setEventsPerPage(8);
        }
        else {
        setEventsPerPage(4);
        }
    };

    updatePageSize();

    window.addEventListener(
        "resize",
        updatePageSize
    );

    return () =>
        window.removeEventListener(
        "resize",
        updatePageSize
        );

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

  const lastIndex =
    currentPage * eventsPerPage;

  const firstIndex =
    lastIndex - eventsPerPage;

  const currentEvents =
    events.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      events.length /
      eventsPerPage
    );

    const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    };

  return (
    <>
      <Navbar
        search=""
        setSearch={() => {}}
        selectedCategory="All"
        setSelectedCategory={() => {}}
        events={events}
      />

      <div
        style={{
          padding: "40px"
        }}
      >
        <h1>
          All Events
        </h1>

        <div className="event-grid">
          {currentEvents.map(
            (event) => (
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

                  <h3>
                    {event.name}
                  </h3>

                  <p>
                    📍 {event.venue}
                  </p>

                  <p
                    style={{
                      color:
                        "#10b981",
                      fontWeight:
                        "bold"
                    }}
                  >
                    ₹{event.price}
                  </p>

                  <Link
                    to={`/event/${event.id}`}
                  >
                    <button className="details-btn">
                      View Details
                    </button>
                  </Link>

                </div>
              </div>
            )
          )}
        </div>

        {/* Pagination */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            gap: "10px",
            marginTop: "40px"
          }}
        >
          {[...Array(totalPages)]
            .map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
                style={{
                  width: "45px",
                  height: "45px",
                  border:
                    currentPage ===
                    index + 1
                      ? "none"
                      : "1px solid #ddd",
                  background:
                    currentPage ===
                    index + 1
                      ? "#2563eb"
                      : "white",
                  color:
                    currentPage ===
                    index + 1
                      ? "white"
                      : "black",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer"
                }}
              >
                {index + 1}
              </button>
            ))}
        </div>
      </div>

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
            boxShadow:
                "0 4px 12px rgba(0,0,0,0.3)"
            }}
        >
            ↑
        </button>
        )}

      <Footer />
    </>
  );
}

export default Events;