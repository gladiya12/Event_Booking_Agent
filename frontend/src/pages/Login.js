import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "400px",
          margin: "100px auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 15px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            background: "#e5e7eb"
          }}
        >
          ← Back
        </button>

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px"
          }}
        />

        <button
          onClick={() =>
            navigate("/booking", {
              state: {
                event: location.state?.event
              }
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center"
          }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </>
  );
}

export default Login;