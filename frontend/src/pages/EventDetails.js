import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useLocation
} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [rating, setRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const totalSeats = 328;

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

    fetch(
      `http://127.0.0.1:5000/event-rating/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRating(data);
      });

    fetch(
      `http://127.0.0.1:5000/event-reviews/${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
      });

  }, [id]);

  if (!event) {
    return (
      <>
        <Navbar />
        <h2
          style={{
            textAlign: "center",
            marginTop: "100px"
          }}
        >
          Loading...
        </h2>
      </>
    );
  }

  const selectedSchedule =
    event.schedules?.find(
      (schedule) =>
        schedule.date === selectedDate
    );

  const occupiedSeats =
    JSON.parse(
      localStorage.getItem(
        `occupiedSeats_${event.id}`
      )
    ) || [];

  const seatsLeft =
    totalSeats - occupiedSeats.length;

  const infoCardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0"
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <div
        style={{
          position: "relative",
          height: "550px",
          overflow: "hidden"
        }}
      >
        <img
          src={event.image}
          alt={event.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))"
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "70px",
            left: "80px",
            color: "white",
            maxWidth: "850px"
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "8px 18px",
              borderRadius: "30px",
              background: "rgba(124,58,237,0.9)",
              fontWeight: "600",
              fontSize: "14px",
              marginBottom: "20px"
            }}
          >
            {event.category}
          </span>

          <h1
            style={{
              fontSize: "54px",
              fontWeight: "700",
              marginBottom: "15px",
              lineHeight: "1.1"
            }}
          >
            {event.name}
          </h1>

          <p
            style={{
              color: "#f59e0b",
              fontSize: "18px",
              fontWeight: "600"
            }}
          >
            ⭐ {rating?.average_rating || 0}

            (
            {rating?.total_reviews || 0}
            Reviews)
          </p>

          <div
            style={{
              display: "flex",
              gap: "25px",
              flexWrap: "wrap",
              fontSize: "18px"
            }}
          >

            <span>📍 {event.venue}</span>
            <span>🎟 ₹{event.price}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          background: "#f8fafc",
          padding: "40px 0 60px"
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px"
          }}
        >
          {/* LEFT SIDE */}
          <div>
            {/* ABOUT */}
            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "20px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
              }}
            >
              <h2>About This Event</h2>

              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.8",
                  fontSize: "18px"
                }}
              >
                {event.description}
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "20px",
                marginTop: "25px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
              }}
            >
              <h2>Event Highlights</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: "20px",
                  marginTop: "20px"
                }}
              >
                {[
                  "Certificate Included",
                  "Industry Experts",
                  "Hands-on Workshop",
                  "Networking Session",
                  "Career Guidance",
                  "Live Demonstration"
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      background: "#f8fafc",
                      padding: "15px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      color: "#334155",
                      border: "1px solid #e2e8f0"
                    }}
                  >
                    ✅ {item}
                  </div>
                ))}
              </div>
            </div>

            {/* EVENT INFO */}
            <div
              style={{
                marginTop: "25px",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px"
              }}
            >

              <div style={infoCardStyle}>
              <h3>📍 Venue</h3>
              <p>{event.venue}</p>
            </div>

            <div style={infoCardStyle}>
              <h3>🎫 Category</h3>
              <p>{event.category}</p>
            </div>

            <div style={infoCardStyle}>
              <h3>💰 Ticket Price</h3>
              <p>₹{event.price}</p>
            </div>
            </div>

            {/* REVIEWS */}

            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "20px",
                marginTop: "25px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
              }}
            >
              <h2>
                ⭐ Reviews ({reviews.length})
              </h2>

              {reviews.length === 0 ? (
                <p
                  style={{
                    color: "#64748b",
                    marginTop: "20px"
                  }}
                >
                  No reviews yet.
                </p>
              ) : (
                reviews.map((review, index) => (
                  <div
                    key={index}
                    style={{
                      borderBottom:
                        "1px solid #e2e8f0",
                      padding: "15px 0"
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: "5px"
                      }}
                    >
                      {review.name}
                    </h4>

                    <p
                      style={{
                        color: "#f59e0b",
                        fontWeight: "600"
                      }}
                    >
                      {"⭐".repeat(review.rating)}
                    </p>

                    <p
                      style={{
                        color: "#475569"
                      }}
                    >
                      {review.review}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* RECOMMENDATIONS */}
            <div style={{ marginTop: "50px" }}>
              <h2>You May Also Like</h2>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  marginTop: "20px"
                }}
              >
                {relatedEvents.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      navigate(`/event/${item.id}`)
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(-8px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        "translateY(0)";
                    }}
                    style={{
                      width: "300px",
                      background: "white",
                      borderRadius: "18px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.08)"
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover"
                      }}
                    />

                    <div style={{ padding: "15px" }}>
                      <h3>{item.name}</h3>

                      <p style={{ color: "#64748b" }}>
                        📅 {
                          new Date(item.schedules?.[0]?.date)
                            .toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })
                        }
                      </p>

                      <p style={{ color: "#64748b" }}>
                        📂 {item.category}
                      </p>

                      <h3 style={{ color: "#10b981" }}>
                        ₹{item.price}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div
              style={{
                position: "sticky",
                top: "100px",
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
              }}
            >
              <h1
                style={{
                  color: "#10b981",
                  fontSize: "64px",
                  marginBottom: "0"
                }}
              >
                ₹{event.price}
              </h1>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px"
                }}
              >
                Per Attendee
              </p>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  marginBottom: "25px"
                }}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "25px",
                  color: "#475569"
                }}
              >
                <div>📍 {event.venue}</div>
                <div>🎫 {event.category}</div>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #e2e8f0",
                  marginBottom: "25px"
                }}
              />

              <h3
                style={{
                  marginTop: "20px",
                  marginBottom: "12px",
                  color: "#0f172a"
                }}
              >
                 Select Date
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "25px"
                }}
              >
                {event.schedules?.map((schedule) => (
                  <button
                    key={schedule.date}
                    onClick={() => {
                      setSelectedDate(schedule.date);
                      setSelectedTime("");
                    }}
                    style={{
                      padding: "14px 24px",
                      borderRadius: "12px",
                      border:
                        selectedDate === schedule.date
                          ? "2px solid #7c3aed"
                          : "1px solid #e2e8f0",
                      background:
                        selectedDate === schedule.date
                          ? "#f3e8ff"
                          : "white",
                      color: "#0f172a",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "0.3s"
                    }}
                  >
                    {new Date(schedule.date)
                      .toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                  </button>
                ))}
              </div>
{selectedDate && (
  <>
    <h3
      style={{
        marginBottom: "12px",
        color: "#0f172a"
      }}
    >
      🕒 Select Time Slot
    </h3>

    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "25px"
      }}
    >
      {selectedSchedule?.time_slots.map(
        (time) => (
          <button
            key={time}
            onClick={() =>
              setSelectedTime(time)
            }
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border:
                selectedTime === time
                  ? "2px solid #7c3aed"
                  : "1px solid #e2e8f0",
              background:
                selectedTime === time
                  ? "#f3e8ff"
                  : "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.3s"
            }}
          >
            {time}
          </button>
        )
      )}
    </div>
  </>
)}

              <ul
                style={{
                  lineHeight: "2",
                  color: "#475569",
                  paddingLeft: "20px"
                }}
              >
                <li>Certificate Included</li>
                <li>Refreshments Included</li>
                <li>Networking Access</li>
                <li>Workshop Materials</li>
              </ul>

              <p
                style={{
                  color:
                    seatsLeft < 50
                      ? "#ef4444"
                      : "#16a34a",
                  fontWeight: "bold",
                  marginTop: "20px"
                }}
              >
                {seatsLeft < 50
                  ? `🔥 Fast Filling - Only ${seatsLeft} Seats Left`
                  : `${seatsLeft} Seats Available`}
                  
              </p>
              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "5px"
                }}
              >
                {occupiedSeats.length} seats already booked
              </p>

              <div
                style={{
                  background: "#f1f5f9",
                  padding: "12px",
                  borderRadius: "10px",
                  textAlign: "center",
                  color: "#475569",
                  fontSize: "14px",
                  marginTop: "20px"
                }}
              >
                🔒 Secure Booking • Instant Confirmation
              </div>

              <button
  onClick={() => {
    const currentUser =
      localStorage.getItem("currentUser");

    if (!currentUser) {
      navigate("/login", {
  state: {
    redirectTo: "/seat-selection",
    bookingData: {
      event,
      selectedDate,
      selectedTime
    }
  }
});
      return;
    }

    navigate("/seat-selection", {
      state: {
        event,
        selectedDate,
        selectedTime
      }
    });
  }}
  disabled={!selectedDate || !selectedTime}
  style={{
    width: "100%",
    marginTop: "20px",
    padding: "18px",
    border: "none",
    borderRadius: "12px",
    background:
      "linear-gradient(135deg,#7c3aed,#a855f7)",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    opacity:
      !selectedDate || !selectedTime
        ? 0.6
        : 1
  }}
>
  Reserve Your Seat →
</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventDetails;