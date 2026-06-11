import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/events/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
      });

    fetch("http://127.0.0.1:5000/events")
      .then((response) => response.json())
      .then((events) => {
        const filtered = events.filter(
          (item) => item.id !== Number(id)
        );

        setRelatedEvents(filtered);
      });
  }, [id]);

  if (!event) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 15px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#e5e7eb"
          }}
        >
          ← Back to Events
        </button>

        <h1>{event.name}</h1>

        <img
          src={event.image}
          alt={event.name}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />

        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>📂 Category:</strong> {event.category}
          </p>

          <p>
            <strong>📅 Date:</strong> {event.date}
          </p>

          <p>
            <strong>📍 Venue:</strong> {event.venue}
          </p>

          <p>
            <strong>💰 Price:</strong> ₹{event.price}
          </p>
        </div>

        <p
          style={{
            fontSize: "18px",
            marginTop: "20px"
          }}
        >
          {event.description}
        </p>

        <button
          onClick={() =>
            navigate("/login", {
              state: { event }
            })
          }
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Book Now
        </button>

        <h2 style={{ marginTop: "40px" }}>
          You May Also Like
        </h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap"
          }}
        >
          {relatedEvents.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/event/${item.id}`)}
              style={{
                width: "220px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s"
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover"
                }}
              />

              <div style={{ padding: "10px" }}>
                <h4>{item.name}</h4>
                <p>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EventDetails;