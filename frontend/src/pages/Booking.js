import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event;

  const [tickets, setTickets] = useState(1);

  if (!event) {
    return (
      <>
        <Navbar />

        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h2>No Event Selected</h2>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Back Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "60px auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 15px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#e5e7eb"
          }}
        >
          ← Back
        </button>

        <h1>Book Tickets</h1>

        <div style={{ marginTop: "20px" }}>
          <h2>{event.name}</h2>

          <p>📅 {event.date}</p>

          <p>📍 {event.venue}</p>

          <p>💰 ₹{event.price}</p>

          <label>Number of Tickets</label>

          <input
            type="number"
            min="1"
            max="10"
            value={tickets}
            onChange={(e) => setTickets(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
              marginBottom: "20px"
            }}
          />
        </div>

        <button
          onClick={() => {
            const booking = {
              eventName: event.name,
              tickets: tickets,
              venue: event.venue,
              date: event.date
            };

            const existingBookings =
              JSON.parse(localStorage.getItem("bookings")) || [];

            existingBookings.push(booking);

            localStorage.setItem(
              "bookings",
              JSON.stringify(existingBookings)
            );

            navigate("/seat-selection", {
              state: {
                event
              }
            });
          }}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Confirm Booking
        </button>
      </div>
    </>
  );
}

export default Booking;