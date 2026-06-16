import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const event = location.state?.event;
  const selectedDate = location.state?.selectedDate;
  const selectedTime = location.state?.selectedTime;

  if (!event) {
    return (
      <>
        <Navbar />

        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>No Event Found</h1>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#7c3aed",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>

        <Footer />
      </>
    );
  }

  const occupiedSeats = [
    "A5",
    "A6",
    "B8",
    "C4",
    "C5",
    "D10",
    "E11",
    "F3",
    "G7",
    "H8",
    "J5",
    "K13",
  ];

  const VIP_ROWS = ["A", "B"];
  const PREMIUM_ROWS = ["C", "D", "E", "F"];
  const STANDARD_ROWS = ["G", "H", "J", "K", "L"];

  const generateSeats = (row, count) => {
    return Array.from({ length: count }, (_, i) => `${row}${i + 1}`);
  };

  const handleSeatClick = (seat) => {
    if (occupiedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatPrice = (seat) => {
    const row = seat.charAt(0);

    if (VIP_ROWS.includes(row)) return 500;

    if (PREMIUM_ROWS.includes(row)) return 350;

    return 200;
  };

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const renderSection = (rows, seatCount, title, price) => (
    <>
      <h3
        style={{
          textAlign: "center",
          margin: "35px 0 20px",
          color: "#111827",
          fontSize: "24px",
        }}
      >
        {title} ₹{price}
      </h3>

      {rows.map((row) => (
        <div
          key={row}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          {generateSeats(row, seatCount / 2).map((seat, index) => {
            const isOccupied = occupiedSeats.includes(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <button
                key={seat}
                onClick={() => handleSeatClick(seat)}
                disabled={isOccupied}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: isOccupied
                    ? "#d1d5db"
                    : isSelected
                    ? "#22c55e"
                    : "#fff",
                  cursor: isOccupied ? "not-allowed" : "pointer",
                }}
              >
                {index + 1}
              </button>
            );
          })}

          <div style={{ width: "50px" }} />

          {generateSeats(row, seatCount / 2).map((seat, index) => {
            const seatNo = seatCount / 2 + index + 1;
            const fullSeat = row + seatNo;

            const isOccupied = occupiedSeats.includes(fullSeat);
            const isSelected = selectedSeats.includes(fullSeat);

            return (
              <button
                key={fullSeat}
                onClick={() => handleSeatClick(fullSeat)}
                disabled={isOccupied}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: isOccupied
                    ? "#d1d5db"
                    : isSelected
                    ? "#22c55e"
                    : "#fff",
                  cursor: isOccupied ? "not-allowed" : "pointer",
                }}
              >
                {seatNo}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#f1f5f9",
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "60px",
            marginBottom: "40px",
          }}
        >
          🎟 Select Your Seats
        </h1>

        <div
          style={{
            display: "flex",
            gap: "30px",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 2,
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
            }}
          >
            <div
              style={{
                width: "90%",
                margin: "0 auto 60px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: "90px",
                  borderTop: "8px solid #111827",
                  borderRadius: "100% 100% 0 0",
                }}
              />
              <h2>SCREEN</h2>
            </div>

            {renderSection(VIP_ROWS, 16, "VIP", 500)}
            {renderSection(PREMIUM_ROWS, 18, "PREMIUM", 350)}
            {renderSection(STANDARD_ROWS, 20, "STANDARD", 200)}
          </div>

          <div
            style={{
              width: "400px",
              background: "#fff",
              borderRadius: "20px",
              padding: "30px",
            }}
          >
            <h2>{event.name}</h2>

            <p>📅 {selectedDate}</p>
            <p>🕒 {selectedTime}</p>
            <p>📍 {event.venue}</p>

            <hr />

            <h3>Selected Seats</h3>

            <p>
              {selectedSeats.length
                ? selectedSeats.join(", ")
                : "No seats selected"}
            </p>

            <h3>Tickets: {selectedSeats.length}</h3>

            <h1
              style={{
                color: "#10b981",
              }}
            >
              ₹{totalPrice}
            </h1>

            <button
              disabled={selectedSeats.length === 0}
              onClick={() =>
                navigate("/payment", {
                  state: {
                    event,
                    seats: selectedSeats,
                    selectedDate,
                    selectedTime,
                  },
                })
              }
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "18px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Continue To Payment →
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default SeatSelection;