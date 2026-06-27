import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
function Navbar({
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    events = []
}) {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light"
);

useEffect(() => {
  document.body.className = theme;

  localStorage.setItem(
    "theme",
    theme
  );
}, [theme]);
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const currentUser =
      JSON.parse(
        localStorage.getItem(
          "currentUser"
        )
      );

    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    alert("Logged Out");

    navigate("/");

    window.location.reload();
  };

  return (
    <nav
      style={{
        background: "#0f172a",
        padding: "18px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none"
  }}
>
  <img
    src="/Event Hub.png"
    alt="EventHub Logo"
    style={{
      width: "40px",
      height: "40px",
      objectFit: "contain"
    }}
  />

  <span
    style={{
      color: "white",
      fontSize: "28px",
      fontWeight: "700"
    }}
  >
    EventHub
  </span>
</Link>

<div
  style={{
    display: "flex",
    alignItems: "center",
    background: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "700px",
    marginLeft: "20px",
    marginRight: "20px",
    flex: 1
  }}
>
  <input
    type="text"
    placeholder="Search for Events, Workshops, Concerts..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    style={{
      flex: 1,
      padding: "16px",
      border: "none",
      outline: "none",
      background: "transparent",
      color: "white",
      fontSize: "16px"
    }}
  />

  <select
    value={selectedCategory}
    onChange={(e) =>
      setSelectedCategory(e.target.value)
    }
    style={{
      padding: "16px",
      border: "none",
      background: "#1e293b",
      color: "white",
      fontSize: "16px",
      cursor: "pointer"
    }}
  >
    <option value="All">
      All
    </option>

    {[...new Set(
      (events || []).map(
        (event) => event.category
      )
    )].map((category) => (
      <option
        key={category}
        value={category}
      >
        {category}
      </option>
    ))}
  </select>
</div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px"
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Home
        </Link>

        {user && (
          <Link
            to="/my-bookings"
            style={{
              color: "white",
              textDecoration: "none"
            }}
          >
            My Bookings
          </Link>
        )}

        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                color: "#38bdf8",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              Login
            </Link>

            <Link to="/register">
              <button
                style={{
                  padding: "12px 25px",
                  border: "none",
                  borderRadius: "30px",
                  background:
                    "linear-gradient(90deg,#7c3aed,#9333ea)",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Register
              </button>
            </Link>
          </>
        ) : (
          <>
           <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "white",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              <FaUserCircle size={28} />
              <span>{user.name}</span>
            </Link>
                        <button
              onClick={() =>
                setTheme(
                  theme === "light"
                    ? "dark"
                    : "light"
                )
              }
              style={{
                padding: "10px 15px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer"
              }}
            >
              {theme === "light"
                ? "🌙 Dark"
                : "☀️ Light"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "25px",
                background: "#ef4444",
                color: "white",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;