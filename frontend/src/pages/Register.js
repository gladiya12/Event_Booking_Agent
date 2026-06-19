import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const handleRegister = async () => {


  if (
    !name ||
    !email ||
    !password
  ) {
    Swal.fire({
      icon: "warning",
      title: "Fill all fields",
      confirmButtonColor: "#7c3aed"
    });
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Passwords do not match",
      confirmButtonColor: "#7c3aed"
    });
    return;
  }

  try {

    // Send OTP automatically

    const otpResponse = await fetch(
      "http://127.0.0.1:5000/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        })
      }
    );

    const otpData =
      await otpResponse.json();

    const { value: enteredOtp } =
    await Swal.fire({
      title: "Email Verification",
      text:
        "OTP has been sent to your email",
      input: "text",
      inputPlaceholder:
        "Enter OTP",
      showCancelButton: true,
      confirmButtonText:
        "Verify OTP"
    });

    if (!enteredOtp) {
      return;
    }

    const verifyResponse =
    await fetch(
      "http://127.0.0.1:5000/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp
        })
      }
    );

    const verifyData =
    await verifyResponse.json();

    if (!verifyData.success) {

      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: verifyData.message
      });

      return;
    }

    const response = await fetch(
      "http://127.0.0.1:5000/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          city
        })
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Thank You!",
        text: data.message,
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(data.user)
    );

    Swal.fire({
      icon: "success",
      title: "Registration Successful",
      text: "Your account has been created.",
      confirmButtonColor: "#7c3aed"
    });

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

    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: "Backend connection failed",
      confirmButtonColor: "#7c3aed"
    });

    console.error(error);
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Location / City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={inputStyle}
          />

          {/* Button */}

          <button
            onClick={handleRegister}
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