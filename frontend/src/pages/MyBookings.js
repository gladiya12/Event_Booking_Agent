import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyBookings() {
  const navigate = useNavigate();

  const bookings =
    JSON.parse(localStorage.getItem("bookings")) || [];

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "40px auto"
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 15px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#e5e7eb"
          }}
        >
          ← Back To Home
        </button>

        <h1>My Bookings</h1>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((booking, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "25px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
              }}
            >
              <h2>{booking.eventName}</h2>

              <p>📅 Date: {booking.date}</p>

              <p>📍 Venue: {booking.venue}</p>

              <p>🎟 Tickets: {booking.tickets}</p>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyBookings;