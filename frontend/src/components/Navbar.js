import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        background: "#1e293b",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>🎟 Event Booking Agent</h2>

      <div
        style={{
          display: "flex",
          gap: "25px"
        }}
      >
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Home
        </Link>

        <Link
          to="/my-bookings"
          style={{ color: "white", textDecoration: "none" }}
        >
          My Bookings
        </Link>

        <Link
          to="/profile"
          style={{ color: "white", textDecoration: "none" }}
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;