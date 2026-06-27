import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { venueLayouts } from "../layouts/venueLayouts";
import StadiumLayout from "../components/seatLayouts/StadiumLayout";
import AuditoriumLayout from "../components/seatLayouts/AuditoriumLayout";
import ConferenceLayout from "../components/seatLayouts/ConferenceLayout";
import TheatreLayout from "../components/seatLayouts/TheatreLayout";
import ExhibitionLayout from "../components/seatLayouts/ExhibitionLayout";
import Swal from "sweetalert2";

function SeatSelection() {
  const isDark =
  localStorage.getItem("theme") === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSeats, setSelectedSeats] = useState(
    location.state?.seats || []
  );
  const [ticketCount, setTicketCount] = useState(
    location.state?.seats?.length || 1
  );
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const event = location.state?.event;
  const venueType =
    venueLayouts[event?.venue] ||
    venueLayouts.default;
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

  const defaultOccupiedSeats = [
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

const occupiedSeats = [
  ...defaultOccupiedSeats,
  ...(
    JSON.parse(
      localStorage.getItem(
        `occupiedSeats_${event.id}`
      )
    ) || []
  ),
];
  const VIP_ROWS = ["A", "B", "C", "D"];
  const PREMIUM_ROWS = ["E", "F", "G", "H"];
  const STANDARD_ROWS = ["I", "J", "K", "L", "M", "N", "O"];

  const generateSeats = (row, count) => {
    return Array.from({ length: count }, (_, i) => `${row}${i + 1}`);
  };

  const handleSeatClick = (seat) => {
  const row = seat.charAt(0);
  const startSeat = parseInt(
    seat.slice(1)
  );

  const maxSeat =
    VIP_ROWS.includes(row)
      ? 22
      : PREMIUM_ROWS.includes(row)
      ? 18
      : 24;

  const seatsToBook = [];

  for (
    let i = 0;
    i < ticketCount;
    i++
  ) {
    const seatNo = startSeat + i;

    if (seatNo > maxSeat) {
      Swal.fire({
        icon: "warning",
        title: "Seats Unavailable",
        text: "Not enough adjacent seats available.",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    seatsToBook.push(
      `${row}${seatNo}`
    );
  }

  const invalidSeat =
    seatsToBook.some((s) =>
      occupiedSeats.includes(s)
    );

  if (invalidSeat) {
    Swal.fire({
      icon: "warning",
      title: "Seats Unavailable",
      text: "Not enough adjacent seats available.",
      confirmButtonColor: "#7c3aed"
    });
    return;
  }

  setSelectedSeats(seatsToBook);
};

  const getSeatPrice = (seat) => {
  const row = seat.charAt(0);

  if (VIP_ROWS.includes(row))
    return 500;

  if (PREMIUM_ROWS.includes(row))
    return 350;

  return 200;
};

  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const renderSeat = (seat) => {
  const isOccupied =
    occupiedSeats.includes(seat);

  const isSelected =
    selectedSeats.includes(seat);

  return (
    <button
      key={seat}
      onClick={() => handleSeatClick(seat)}
      disabled={isOccupied}
      style={{
        width: "38px",
        height: "38px",
        borderRadius: "4px",
        border: "1px solid #cbd5e1",
        background: isOccupied
  ? "#9ca3af"      // Grey
  : isSelected
  ? "#22c55e"      // Green
  : "#ffffff",     // White

color: isOccupied
  ? "#ffffff"
  : "#111827",

border: isOccupied
  ? "1px solid #9ca3af"
  : isSelected
  ? "1px solid #22c55e"
  : "1px solid #cbd5e1",
        cursor: isOccupied
          ? "not-allowed"
          : "pointer",
        fontSize: "12px",
      }}
    >
      {seat.slice(1)}
    </button>
  );
};
  const renderCinemaRows = (
  rows,
  leftSeats,
  centerSeats,
  rightSeats,
  title,
  price
) => (
  <>
    <div
  style={{
    borderTop: "1px solid #d1d5db",
    marginTop: "30px",
    paddingTop: "20px",
  }}
>
  <h3
    style={{
      textAlign: "center",
      marginBottom: "20px",
      color: "#374151",
    }}
  >
    ₹{price} {title}
  </h3>
</div>

    {rows.map((row) => (
  <div
    key={row}
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    }}
  >
    {/* Row Label */}
    <div
      style={{
        width: "40px",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      {row}
    </div>

    {/* Seat Blocks */}
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "40px",
      }}
    >
      {/* LEFT BLOCK */}
      <div style={{ display: "flex", gap: "6px" }}>
        {Array.from(
          { length: leftSeats },
          (_, i) => `${row}${i + 1}`
        ).map(renderSeat)}
      </div>

      {/* CENTER BLOCK */}
      <div style={{ display: "flex", gap: "6px" }}>
        {Array.from(
          { length: centerSeats },
          (_, i) =>
            `${row}${i + leftSeats + 1}`
        ).map(renderSeat)}
      </div>

      {/* RIGHT BLOCK */}
      <div style={{ display: "flex", gap: "6px" }}>
        {Array.from(
          { length: rightSeats },
          (_, i) =>
            `${row}${i + leftSeats + centerSeats + 1}`
        ).map(renderSeat)}
      </div>
    </div>
  </div>
))}
  </>
);
  return (
    <>
      <Navbar />

      <div
        style={{
          background: isDark
            ? "#0f172a"
            : "#f1f5f9",
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
    alignItems: "flex-start",
    gap: "30px",
    maxWidth: "1600px",
    margin: "0 auto",
  }}
>
          <div
            style={{
              flex: 3,
              background: isDark
                ? "#1e293b"
                : "#ffffff",
              borderRadius: "20px",
              padding: "40px",
              overflowX: "auto"
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
              <h2
  style={{
    color: isDark
      ? "#ffffff"
      : "#111827",
  }}
>
  SCREEN
</h2>
            </div>

          {
            venueType === "stadium" && (
              <StadiumLayout
                renderCinemaRows={renderCinemaRows}
              />
            )
          }

          {
            venueType === "auditorium" && (
              <AuditoriumLayout
                renderCinemaRows={renderCinemaRows}
              />
            )
          }

          {
            venueType === "conference" && (
              <ConferenceLayout
                renderCinemaRows={renderCinemaRows}
              />
            )
          }

          {
            venueType === "theatre" && (
              <TheatreLayout
                renderCinemaRows={renderCinemaRows}
              />
            )
          }

          {
            venueType === "exhibition" && (
              <ExhibitionLayout
                renderCinemaRows={renderCinemaRows}
              />
            )
          }
          </div>

          <div
            style={{
             width: "380px",
background: "#fff",
borderRadius: "20px",
padding: "30px",
position: "sticky",
top: "100px",
height: "fit-content",
boxShadow:
  "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{event.name}</h2>

            <p>📅 {selectedDate}</p>
            <p>🕒 {selectedTime}</p>
            <p>📍 {event.venue}</p>

            <hr />
            <h3>Select Number of Tickets</h3>

<select
  disabled={location.state?.seats}
  value={ticketCount}
  onChange={(e) =>
    setTicketCount(Number(e.target.value))
  }
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  }}
>
  {Array.from({ length: 10 }, (_, i) => (
    <option
      key={i + 1}
      value={i + 1}
    >
      {i + 1} Tickets
    </option>
  ))}
</select>
<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginTop: "10px",
  }}
>
  <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    marginTop: "10px",
    marginBottom: "10px",
  }}
>
  <div>
    <span
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        marginRight: "8px",
      }}
    />
    Available
  </div>

  <div>
    <span
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        background: "#22c55e",
        marginRight: "8px",
      }}
    />
    Selected
  </div>

  <div>
    <span
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        background: "#9ca3af",
        marginRight: "8px",
      }}
    />
    Occupied
  </div>
</div>
</div>
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