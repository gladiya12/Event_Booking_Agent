import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {

  const currentUser =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  if (!currentUser) return;

  fetch(
    `http://127.0.0.1:5000/my-bookings/${currentUser.id}`
  )
    .then((response) =>
      response.json()
    )
    .then((data) => {
      setBookings(data);
    });

}, []);

  const totalSpent = bookings.reduce(
  (sum, booking) =>
    sum + Number(booking.total_amount || 0),
  0
);
  const cancelBooking = async (bookingId) => {

  const confirmCancel =
    window.confirm(
      "Are you sure you want to cancel this booking?"
    );

  if (!confirmCancel) return;

  await fetch(
    `http://127.0.0.1:5000/cancel-booking/${bookingId}`,
    {
      method: "DELETE",
    }
  );

  const updatedBookings =
    bookings.filter(
      (booking) =>
        booking.booking_id !== bookingId
    );

  setBookings(updatedBookings);

  Swal.fire({
    icon: "success",
    title: "Booking Cancelled",
    text: "Your booking has been cancelled successfully.",
    confirmButtonColor: "#7c3aed"
  });
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
                        booking.event_image
                      }
                      alt={
                        booking.event_name
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
                         booking.event_name
                        }
                      </h2>

                      <p>
                        📆 {booking.selected_date}
                      </p>

                      <p>
                        🕒 {booking.selected_time}
                      </p>

                      <p>
                        📍{" "}
                        {
                          booking.event_venue
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
                          booking.booking_id
                        }
                      </p>

                      <p>
                        <strong>Seats:</strong>{" "}
                        {booking.seats}
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
                          {booking.status}
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
                            booking.total_amount
                          }
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          navigate("/booking-success", {
                            state: {
                              event: {
                                id: booking.event_id,
                                name: booking.event_name,
                                image: booking.event_image,
                                venue: booking.event_venue
                              },
                              seats: booking.seats.split(","),
                              total: booking.total_amount,
                              bookingId: booking.booking_id,
                              selectedDate: booking.selected_date,
                              selectedTime: booking.selected_time
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
                        onClick={() =>
                          navigate("/rate-event", {
                            state: {
                              event: {
                                id: booking.event_id,
                                name:
                                  booking.event_name
                              }
                            }
                          })
                        }
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "14px",
                          border: "none",
                          borderRadius: "12px",
                          background: "#10b981",
                          color: "white",
                          cursor: "pointer"
                        }}
                      >
                        ⭐ Rate Event
                      </button>
                      <button
                        onClick={() => cancelBooking(booking.booking_id)}
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