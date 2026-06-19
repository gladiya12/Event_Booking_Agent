import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

function RateEvent() {

  const location = useLocation();

  const event =
    location.state?.event;

  const [rating, setRating] =
    useState(5);

  const [review, setReview] =
    useState("");

  const submitRating = async () => {

    console.log("Event Object:", event);
    console.log("Event ID:", event?.id);

    const user = JSON.parse(
      localStorage.getItem("currentUser")
    );

    console.log({
      user_id: user.id,
      event_id: event?.id,
      rating,
      review
    });

    console.log({
      user_id: user.id,
      event_id: event.id,
      rating,
      review
    });

    const response = await fetch(
      "http://127.0.0.1:5000/rate-event",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          event_id: event?.id,
          rating,
          review
        })
      }
    );

    const data = await response.json();

    Swal.fire({
      icon: "success",
      title: "Review Submitted",
      text: data.message,
      confirmButtonColor: "#7c3aed"
    });
  };

  return (
    <>
        <Navbar />

        <div
        style={{
            minHeight: "100vh",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px"
        }}
        >
        <div
            style={{
            width: "100%",
            maxWidth: "700px",
            background: "white",
            padding: "40px",
            borderRadius: "25px",
            boxShadow: "0 10px 30px rgba(0,0,0,.08)"
            }}
        >
            <h1
            style={{
                color: "#0f172a",
                marginBottom: "10px"
            }}
            >
            ⭐ Rate {event.name}
            </h1>

            <p
            style={{
                color: "#64748b",
                marginBottom: "30px"
            }}
            >
            Share your experience with other users.
            </p>

            <label
            style={{
                fontWeight: "600"
            }}
            >
            Rating (1-5)
            </label>

            <select
            value={rating}
            onChange={(e) =>
                setRating(e.target.value)
            }
            style={inputStyle}
            >
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
            </select>

            <label
            style={{
                fontWeight: "600"
            }}
            >
            Review
            </label>

            <textarea
            value={review}
            onChange={(e) =>
                setReview(e.target.value)
            }
            placeholder="Tell us about your experience..."
            style={{
                width: "100%",
                minHeight: "120px",
                marginTop: "10px",
                padding: "15px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                resize: "none",
                boxSizing: "border-box"
            }}
            />

            <button
            onClick={submitRating}
            style={{
                width: "100%",
                marginTop: "25px",
                padding: "16px",
                border: "none",
                borderRadius: "12px",
                background:
                "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                fontWeight: "700",
                fontSize: "17px",
                cursor: "pointer"
            }}
            >
            Submit Review ⭐
            </button>
        </div>
        </div>

        <Footer />
    </>
    );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "10px",
  marginBottom: "20px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box"
};
export default RateEvent;