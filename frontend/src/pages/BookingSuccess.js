import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import QRCode from "react-qr-code";
import { jsPDF } from "jspdf";

function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event;
  const seats = location.state?.seats || [];
  const total = location.state?.total || 0;
  const [rating, setRating] = useState(0);
  const selectedDate =
    location.state?.selectedDate ||
    event?.date ||
    "Date Not Available";

  const selectedTime =
    location.state?.selectedTime ||
    "Time Not Selected";

  const bookingId =
    location.state?.bookingId ||
    "EVT-" +
      Math.floor(
        100000 + Math.random() * 900000
      );

  const ticketNo =
    "TKT-" +
    Math.floor(
      100000 + Math.random() * 900000
    );

  if (!event) {
    return (
      <>
        <Navbar />

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f8fafc"
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)"
            }}
          >
            <h1>No Booking Found</h1>

            <p>
              Please book an event first.
            </p>

            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "20px",
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                cursor: "pointer"
              }}
            >
              Browse Events
            </button>
          </div>
        </div>
      </>
    );
  }
  const downloadTicket = () => {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("EventHub Ticket", 20, 20);

  doc.setFontSize(14);
  doc.text(`Event: ${event.name}`, 20, 40);
  doc.text(`Date: ${selectedDate}`, 20, 50);
  doc.text(`Time: ${selectedTime}`, 20, 60);
  doc.text(`Venue: ${event.venue}`, 20, 70);

  doc.text(
    `Seats: ${seats.join(", ")}`,
    20,
    80
  );

  doc.text(
    `Booking ID: ${bookingId}`,
    20,
    90
  );

  doc.text(
    `Ticket No: ${ticketNo}`,
    20,
    100
  );

  doc.text(
    `Total Paid: ₹${total}`,
    20,
    110
  );

  doc.save(
    `${bookingId}.pdf`
  );
};
  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "50px 20px"
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px"
            }}
          >
            <div
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                padding: "10px 20px",
                borderRadius: "999px",
                display: "inline-block",
                fontWeight: "600",
                marginBottom: "20px"
              }}
            >
              ✓ Payment Successful
            </div>

            <h1
              style={{
                color: "#22c55e",
                fontSize: "55px",
                marginBottom: "10px"
              }}
            >
              Booking Confirmed
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "18px"
              }}
            >
              Your ticket has been booked
              successfully.
            </p>
          </div>

          {/* Ticket */}
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "0 15px 35px rgba(0,0,0,.08)"
            }}
          >
            {/* Image */}
            <div
              style={{
                height: "220px"
              }}
            >
              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f"
                }
                alt={event.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            <div
              style={{
                padding: "40px"
              }}
            >
              <h1
                style={{
                  color: "#0f172a",
                  marginBottom: "10px"
                }}
              >
                 {event.name}
              </h1>

              <div
                style={{
                  display: "inline-block",
                  background: "#ede9fe",
                  color: "#7c3aed",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontWeight: "600",
                  marginBottom: "25px"
                }}
              >
                Confirmed Entry Pass
              </div>

              {/* Details */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "15px",
                  marginBottom: "30px"
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px"
                  }}
                >
                  <strong>Date</strong>
                  <p>{selectedDate}</p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px"
                  }}
                >
                  <strong>Time</strong>
                  <p>{selectedTime}</p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px"
                  }}
                >
                  <strong>Venue</strong>
                  <p>{event.venue}</p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px"
                  }}
                >
                  <strong>Seats</strong>
                  <p>
                    {seats.length > 0
                      ? seats.join(", ")
                      : "General Admission"}
                  </p>
                </div>

                <div
                  style={{
                    background: "#f8fafc",
                    padding: "15px",
                    borderRadius: "12px"
                  }}
                >
                  <strong>Total Paid</strong>
                  <p>₹{total}</p>
                </div>
              </div>

              <hr />

              {/* IDs */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "25px",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <h4>Booking ID</h4>
                  <p>{bookingId}</p>
                </div>

                <div>
                  <h4>Ticket Number</h4>
                  <p>{ticketNo}</p>
                </div>
              </div>

              {/* QR */}
              <div
                style={{
                  textAlign: "center",
                  marginTop: "40px"
                }}
              >
                <div
                  style={{
                    background: "#f8fafc",
                    display: "inline-block",
                    padding: "20px",
                    borderRadius: "20px",
                    border:
                      "2px dashed #cbd5e1"
                  }}
                >
                  <QRCode
                    value={`
Event:${event.name}
Date:${selectedDate}
Time:${selectedTime}
Booking:${bookingId}
Seats:${seats.join(",")}
Ticket:${ticketNo}
`}
                    size={180}
                  />
                </div>

                <p
                  style={{
                    marginTop: "15px",
                    color: "#64748b"
                  }}
                >
                   Present this QR code at the venue entrance for ticket verification.
                </p>
              </div>

              {/* Info */}
              <div
                style={{
                  background: "#f8fafc",
                  padding: "20px",
                  borderRadius: "15px",
                  marginTop: "35px"
                }}
              >
                <h3>
                  🎉 Thank you for booking
                  with EventHub
                </h3>
                <div
                  style={{
                    marginTop: "25px",
                    textAlign: "center"
                  }}
                >
                  <h3>Rate This Event</h3>

                  {[1,2,3,4,5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: "35px",
                        cursor: "pointer",
                        color:
                          star <= rating
                            ? "#facc15"
                            : "#d1d5db"
                      }}
                    >
                      ★
                    </span>
                  ))}

                  {rating > 0 && (
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#16a34a",
                        fontWeight: "600"
                      }}
                    >
                      Thanks for rating {rating}/5
                    </p>
                  )}
                </div>
                <p>
                  • Please arrive 30 minutes
                  before the event.
                </p>

                <p>
                  • Carry a valid ID proof.
                </p>

                <p>
                  • Present this QR code at
                  entry.
                </p>
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent:
                    "center",
                  flexWrap: "wrap",
                  marginTop: "35px"
                }}
              >
                <button
  onClick={downloadTicket}
  style={{
    padding: "16px 28px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  }}
>
  Download Ticket
</button>

                <button
                  onClick={() =>
                    navigate(
                      "/my-bookings"
                    )
                  }
                  style={{
                    padding:
                      "16px 28px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #cbd5e1",
                    background:
                      "white",
                    cursor: "pointer"
                  }}
                >
                  My Bookings
                </button>

                <button
                  onClick={() =>
                    navigate("/")
                  }
                  style={{
                    padding:
                      "16px 28px",
                    borderRadius:
                      "12px",
                    border:
                      "1px solid #cbd5e1",
                    background:
                      "white",
                    cursor: "pointer"
                  }}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingSuccess;