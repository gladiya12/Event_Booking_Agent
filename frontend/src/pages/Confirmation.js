import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Confirmation() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "80px auto",
          background: "white",
          padding: "50px",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1>✅ Booking Successful</h1>

        <p
          style={{
            fontSize: "22px",
            marginTop: "20px"
          }}
        >
          Your ticket has been booked successfully.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "40px"
          }}
        >
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 25px",
              minWidth: "160px",
              borderRadius: "6px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Back To Home
          </button>

          <button
            onClick={() => navigate("/my-bookings")}
            style={{
              padding: "12px 25px",
              minWidth: "160px",
              borderRadius: "6px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            My Bookings
          </button>
        </div>
      </div>
    </>
  );
}

export default Confirmation;