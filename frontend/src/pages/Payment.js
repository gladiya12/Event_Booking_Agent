import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

function Payment() {
  const navigate = useNavigate();
    const location = useLocation();
    const event = location.state?.event;

    const seats =
    location.state?.seats || [];

    const selectedDate =
    location.state?.selectedDate || "";

    const selectedTime =
    location.state?.selectedTime || "";

    const [paymentMethod, setPaymentMethod] =
    useState("upi");

    const currentUser =
    localStorage.getItem("currentUser");

    if (!currentUser) {
    navigate("/login");
    return null;
    }

  const bookingId =
    "EVT-" +
    Math.floor(
      100000 + Math.random() * 900000
    );

  if (!event) {
    return (
      <>
        <Navbar />
        <h1
          style={{
            textAlign: "center",
            marginTop: "100px"
          }}
        >
          No booking found
        </h1>
      </>
    );
  }

  const ticketAmount =
    seats.length * (event.price || 0);

  const convenienceFee = 50;

  const gst = Math.round(
    ticketAmount * 0.18
  );

  const total =
    ticketAmount +
    convenienceFee +
    gst;

  const handlePayment = () => {
  const booking = {
  bookingId,
  event,
  seats,
  total,
  selectedDate,
  selectedTime,
  bookingDate: new Date().toISOString(),
  status: "Confirmed"
};

  const existingBookings =
    JSON.parse(
      localStorage.getItem("eventBookings")
    ) || [];

  existingBookings.push(booking);

  localStorage.setItem(
    "eventBookings",
    JSON.stringify(existingBookings)
  );

  navigate("/booking-success", {
  state: {
    event,
    seats,
    total,
    bookingId,
    selectedDate,
    selectedTime
  }
});
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
            maxWidth: "1400px",
            margin: "0 auto"
          }}
        >
          {/* EVENT BANNER */}
          <div
            style={{
              height: "280px",
              borderRadius: "25px",
              overflow: "hidden",
              marginBottom: "35px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.1)"
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
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "30px"
            }}
          >
            {/* LEFT SIDE */}
            <div
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "25px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h1
                style={{
                  color: "#0f172a",
                  marginBottom: "10px"
                }}
              >
                💳 Payment Details
              </h1>

              <p
                style={{
                  color: "#64748b",
                  marginBottom: "30px"
                }}
              >
                Booking ID: {bookingId}
              </p>

              {/* PAYMENT METHODS */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px"
                }}
              >
                <button
                  onClick={() =>
                    setPaymentMethod("upi")
                  }
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border:
                      paymentMethod === "upi"
                        ? "2px solid #7c3aed"
                        : "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "18px"
                  }}
                >
                  📱 UPI Payment
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod("card")
                  }
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border:
                      paymentMethod === "card"
                        ? "2px solid #7c3aed"
                        : "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "18px"
                  }}
                >
                  💳 Credit / Debit Card
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod(
                      "netbanking"
                    )
                  }
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border:
                      paymentMethod ===
                      "netbanking"
                        ? "2px solid #7c3aed"
                        : "1px solid #cbd5e1",
                    background: "white",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "18px"
                  }}
                >
                  🏦 Net Banking
                </button>
              </div>

              {/* FORM */}

              <div
                style={{
                  marginTop: "35px"
                }}
              >
                {paymentMethod === "upi" && (
                  <>
                    <label>UPI ID</label>

                    <input
                      type="text"
                      placeholder="yourname@upi"
                      style={inputStyle}
                    />
                  </>
                )}

                {paymentMethod === "card" && (
                  <>
                    <label>
                      Card Number
                    </label>

                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      style={inputStyle}
                    />

                    <div
                      style={{
                        display: "flex",
                        gap: "15px"
                      }}
                    >
                      <input
                        type="text"
                        placeholder="MM/YY"
                        style={inputStyle}
                      />

                      <input
                        type="text"
                        placeholder="CVV"
                        style={inputStyle}
                      />
                    </div>
                  </>
                )}

                {paymentMethod ===
                  "netbanking" && (
                  <>
                    <label>
                      Bank Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter bank name"
                      style={inputStyle}
                    />
                  </>
                )}
              </div>

              {/* COUPON */}

              <div
                style={{
                  marginTop: "35px"
                }}
              >
                <h3>
                  🎁 Apply Coupon
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    style={{
                      flex: 1,
                      padding: "14px",
                      borderRadius:
                        "10px",
                      border:
                        "1px solid #cbd5e1"
                    }}
                  />

                  <button
                    style={{
                      padding:
                        "14px 20px",
                      border: "none",
                      borderRadius:
                        "10px",
                      background:
                        "#7c3aed",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* PAYMENT LOGOS */}

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "30px",
                  color: "#475569"
                }}
              >
                <span>📱 UPI</span>
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>🏦 RuPay</span>
              </div>
            </div>

            {/* RIGHT SIDE */}

            <div
              style={{
                background: "white",
                padding: "35px",
                borderRadius: "25px",
                height: "fit-content",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)"
              }}
            >
              <h2>{event.name}</h2>

              <p
                style={{
                  color: "#64748b"
                }}
              >
                Booking ID:
                {bookingId}
              </p>

              <p>📅 {event.date}</p>
              <p>📆 {selectedDate}</p>
              <p>🕒 {selectedTime}</p>
              <p>📍 {event.venue}</p>

              <hr
                style={{
                  margin: "20px 0"
                }}
              />

              <h3>Selected Seats</h3>

              <p>
                {seats.length > 0
                  ? seats.join(", ")
                  : "No seats selected"}
              </p>

              <h3>
                Tickets:
                {seats.length}
              </h3>

              <hr
                style={{
                  margin: "20px 0"
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between"
                }}
              >
                <span>
                  Ticket Amount
                </span>

                <span>
                  ₹{ticketAmount}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "10px"
                }}
              >
                <span>
                  Convenience Fee
                </span>

                <span>
                  ₹{convenienceFee}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginTop: "10px"
                }}
              >
                <span>GST</span>

                <span>
                  ₹{gst}
                </span>
              </div>

              <hr
                style={{
                  margin: "20px 0"
                }}
              />

              <h1
                style={{
                  color: "#10b981",
                  fontSize: "50px"
                }}
              >
                ₹{total}
              </h1>

              <div
                style={{
                  background:
                    "#f8fafc",
                  padding: "15px",
                  borderRadius:
                    "12px",
                  marginTop: "20px",
                  color: "#475569"
                }}
              >
                🔒 100% Secure
                Payment
                <br />
                ✓ SSL Encrypted
                <br />
                ✓ Instant
                Confirmation
              </div>

              <p
                style={{
                  color: "#ef4444",
                  fontWeight: "bold",
                  marginTop: "20px"
                }}
              >
                ⏰ Complete payment
                in 09:58
              </p>

              <button
                onClick={handlePayment}
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
                    cursor: "pointer"
                }}
                >
                Pay Now →
                </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "10px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box"
};

export default Payment;