import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          background:
            "linear-gradient(135deg,#f8fafc,#eef2ff)"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "550px",
            background: "white",
            padding: "45px",
            borderRadius: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: "30px",
                background: "#ede9fe",
                color: "#7c3aed",
                fontSize: "13px",
                fontWeight: "600",
                marginBottom: "15px"
              }}
            >
              EventHub AI
            </div>

            <h1
              style={{
                color: "#1e293b",
                marginBottom: "10px",
                fontSize: "48px",
                fontWeight: "700"
              }}
            >
              Create Account 🚀
            </h1>

            <p
              style={{
                color: "#64748b",
                marginBottom: "30px",
                fontSize: "17px"
              }}
            >
              Join EventHub AI and start booking amazing events.
            </p>
          </div>

          {/* Inputs */}

          <input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={(e) =>
    setName(e.target.value)
  }
  style={inputStyle}
/>

          <input
  type="email"
  placeholder="Email Address"
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  style={inputStyle}
/>

          <input
            type="password"
            placeholder="Password"
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            style={inputStyle}
          />

          {/* Button */}

          <button
            onClick={() => {
  localStorage.setItem(
    "currentUser",
    JSON.stringify({
      name,
      email
    })
  );

  const redirectTo =
    location.state?.redirectTo;

  const bookingData =
    location.state?.bookingData;

  if (
    redirectTo === "/seat-selection"
  ) {
    navigate("/seat-selection", {
      state: bookingData
    });
  } else {
    navigate("/");
  }

  window.location.reload();
}}
            style={{
              width: "100%",
              padding: "17px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow:
                "0 15px 35px rgba(124,58,237,0.40)",
              transition: "0.3s"
            }}
          >
            Create Account
          </button>

          {/* Terms */}

          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#64748b",
              marginTop: "18px"
            }}
          >
            By creating an account, you agree to our
            Terms & Conditions.
          </p>

          {/* Login Link */}

          <div
            style={{
              textAlign: "center",
              marginTop: "28px"
            }}
          >
            <p
              style={{
                color: "#64748b",
                marginBottom: "8px"
              }}
            >
              Already have an account?
            </p>

            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "#7c3aed",
                fontWeight: "700",
                fontSize: "18px"
              }}
            >
              Login →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "17px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none"
};

export default Register;