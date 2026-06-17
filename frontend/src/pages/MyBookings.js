import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data =
      JSON.parse(
        localStorage.getItem("eventBookings")
      ) || [];

    setBookings(data.reverse());
  }, []);

  const totalSpent = bookings.reduce(
    (sum, booking) => sum + (booking.total || 0),
    0
  );
  const cancelBooking = (bookingId) => {
  const updatedBookings = bookings.filter(
    (booking) => booking.bookingId !== bookingId
  );

  localStorage.setItem(
    "eventBookings",
    JSON.stringify(updatedBookings)
  );

  setBookings(updatedBookings);

  alert("Booking Cancelled");
};

  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "60px 20px"
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto"
          }}
        >
          {/* HEADER */}
          <div
            style={{
              marginBottom: "40px"
            }}
          >
            <h1
              style={{
                fontSize: "54px",
                fontWeight: "800",
                color: "#0f172a",
                marginBottom: "10px"
              }}
            >
              My Bookings
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "18px"
              }}
            >
              View all your booked events and tickets
            </p>
          </div>

          {/* STATS */}
          {bookings.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "25px",
                marginBottom: "45px"
              }}
            >
              <div
                style={cardStyle}
              >
                <h2
                  style={{
                    color: "#7c3aed",
                    fontSize: "42px",
                    marginBottom: "10px"
                  }}
                >
                  {bookings.length}
                </h2>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Total Bookings
                </p>
              </div>

              <div
                style={cardStyle}
              >
                <h2
                  style={{
                    color: "#10b981",
                    fontSize: "42px",
                    marginBottom: "10px"
                  }}
                >
                  ₹{totalSpent}
                </h2>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  Total Spent
                </p>
              </div>

              <div
                style={cardStyle}
              >
                <h2
                  style={{
                    color: "#16a34a",
                    fontSize: "42px",
                    marginBottom: "10px"
                  }}
                >
                  ✓
                </h2>

                <p
                  style={{
                    color: "#64748b"
                  }}
                >
                  All Tickets Confirmed
                </p>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {bookings.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "80px",
                borderRadius: "25px",
                textAlign: "center",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,.06)"
              }}
            >
              <div
                style={{
                  fontSize: "70px"
                }}
              >
                🎟
              </div>

              <h2
                style={{
                  color: "#0f172a",
                  marginTop: "15px"
                }}
              >
                No Bookings Found
              </h2>

              <p
                style={{
                  color: "#64748b",
                  marginTop: "10px"
                }}
              >
                Start exploring events and book your
                first ticket.
              </p>

              <button
                onClick={() =>
                  navigate("/")
                }
                style={{
                  marginTop: "25px",
                  padding: "16px 30px",
                  border: "none",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg,#7c3aed,#a855f7)",
                  color: "white",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(380px,1fr))",
                gap: "30px"
              }}
            >
              {bookings.map(
                (booking, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      borderRadius: "24px",
                      overflow: "hidden",
                      boxShadow:
                        "0 10px 25px rgba(0,0,0,.08)",
                      transition: "0.3s"
                    }}
                  >
                    {/* EVENT IMAGE */}
                    <img
                      src={
                        booking.event?.image
                      }
                      alt={
                        booking.event?.name
                      }
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover"
                      }}
                    />

                    <div
                      style={{
                        padding: "25px"
                      }}
                    >
                      <h2
                        style={{
                          color: "#0f172a",
                          marginBottom: "15px"
                        }}
                      >
                        {
                          booking.event
                            ?.name
                        }
                      </h2>

                      <p>
                        📅{" "}
                        {
                          booking.event
                            ?.date
                        }
                      </p>
                      <p>
                        📆 {booking.selectedDate}
                      </p>

                      <p>
                        🕒 {booking.selectedTime}
                      </p>

                      <p>
                        📍{" "}
                        {
                          booking.event
                            ?.venue
                        }
                      </p>

                      <hr
                        style={{
                          margin:
                            "18px 0"
                        }}
                      />

                      <p>
                        <strong>
                          Booking ID:
                        </strong>{" "}
                        {
                          booking.bookingId
                        }
                      </p>

                      <p>
                        <strong>
                          Seats:
                        </strong>{" "}
                        {booking.seats?.join(
                          ", "
                        )}
                      </p>

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          marginTop:
                            "20px"
                        }}
                      >
                        <span
                          style={{
                            background:
                              "#dcfce7",
                            color:
                              "#16a34a",
                            padding:
                              "8px 14px",
                            borderRadius:
                              "999px",
                            fontWeight:
                              "600"
                          }}
                        >
                          Confirmed
                        </span>

                        <span
                          style={{
                            fontSize:
                              "22px",
                            fontWeight:
                              "800",
                            color:
                              "#0f172a"
                          }}
                        >
                          ₹
                          {
                            booking.total
                          }
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          navigate("/booking-success", {
                            state: {
                              event: booking.event,
                              seats: booking.seats,
                              total: booking.total,
                              bookingId: booking.bookingId,
                              selectedDate: booking.selectedDate,
                              selectedTime: booking.selectedTime
                            }
                          })
                        }
                        style={{
                          width:
                            "100%",
                          marginTop:
                            "20px",
                          padding:
                            "16px",
                          border:
                            "none",
                          borderRadius:
                            "14px",
                          background:
                            "linear-gradient(135deg,#7c3aed,#a855f7)",
                          color:
                            "white",
                          fontSize:
                            "16px",
                          fontWeight:
                            "700",
                          cursor:
                            "pointer"
                        }}
                      >
                        View Ticket
                      </button>
                      <button
                        onClick={() => cancelBooking(booking.bookingId)}
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "14px",
                          border: "none",
                          borderRadius: "12px",
                          background: "#ef4444",
                          color: "white",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "22px",
  textAlign: "center",
  boxShadow:
    "0 10px 25px rgba(0,0,0,.06)"
};

export default MyBookings;