import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleLogin = async () => {

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(data.user)
    );

    alert("Login Successful");

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

  } catch (error) {

    console.error(error);

    alert(
      "Backend Connection Failed"
    );
  }
};
  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f8fafc",
          padding: "40px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                marginBottom: "10px",
                color: "#1e293b"
              }}
            >
              Welcome Back 👋
            </h1>

            <p
              style={{
                color: "#64748b",
                marginBottom: "30px"
              }}
            >
              Login to continue your event booking journey.
            </p>
          </div>

          <input
  type="email"
  placeholder="Enter Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px"
  }}
/>

          <input
  type="password"
  placeholder="Enter Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    width: "100%",
    padding: "14px",
    marginBottom: "20px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px"
  }}
/>

          <button
           onClick={handleLogin}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow:
                "0 10px 25px rgba(124,58,237,0.35)"
            }}
          >
            Login
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "25px"
            }}
          >
            <p style={{ color: "#64748b" }}>
              Don't have an account?
            </p>

            <Link
  to="/register"
  state={{
    redirectTo: location.state?.redirectTo,
    bookingData: location.state?.bookingData
  }}
>
              Create Account
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;