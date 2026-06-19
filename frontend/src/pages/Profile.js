import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
function Profile() {

  const [profile, setProfile] =
    useState(null);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {

    const currentUser =
      JSON.parse(
        localStorage.getItem("currentUser")
      );

    if (
      !currentUser ||
      !currentUser.id
    ) {
      return;
    }

    fetch(
      `http://127.0.0.1:5000/profile/${currentUser.id}`
    )
      .then((response) =>
        response.json()
      )
      .then((data) => {

        setProfile(data);

        setPhone(
          data.user.phone || ""
        );

        setCity(
          data.user.city || ""
        );

      })
      .catch((error) =>
        console.log(error)
      );

  }, []);

  if (!profile)
  return (
    <>
      <Navbar />
      <div
        style={{
          textAlign: "center",
          padding: "100px",
          fontSize: "24px"
        }}
      >
        Loading Profile...
      </div>
      <Footer />
    </>
  );
  const saveProfile = async () => {

    await fetch(
      `http://127.0.0.1:5000/update-profile/${profile.user.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          phone,
          city
        })
      }
    );

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile has been updated successfully.",
      confirmButtonColor: "#7c3aed"
    });
  };
  return (
  <>
    <Navbar />

    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        padding: "60px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto"
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            color: "#0f172a",
            marginBottom: "30px"
          }}
        >
          My Profile
        </h1>

        {/* PROFILE CARD */}
        <div
          style={{
            background: "white",
            borderRadius: "25px",
            padding: "40px",
            display: "flex",
            gap: "50px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,.08)"
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              width: "250px",
              textAlign: "center"
            }}
          >
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "52px",
                fontWeight: "700"
              }}
            >
              {profile.user.name[0]}
            </div>

            <h2
              style={{
                marginTop: "20px",
                color: "#0f172a"
              }}
            >
              {profile.user.name}
            </h2>

            <p
              style={{
                color: "#64748b"
              }}
            >
              {profile.user.email}
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div style={{ flex: 1 }}>
            <h2
              style={{
                marginBottom: "25px",
                color: "#0f172a"
              }}
            >
              Account Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}
            >
              <div>
                <label>Phone Number</label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Location</label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  placeholder="Enter city"
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  type="text"
                  value={profile.user.email}
                  disabled
                  style={inputStyle}
                />
              </div>

              <div>
                <label>Full Name</label>

                <input
                  type="text"
                  value={profile.user.name}
                  disabled
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              onClick={saveProfile}
              style={{
                marginTop: "30px",
                padding: "15px 35px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
            marginTop: "30px"
          }}
        >
          <div style={cardStyle}>
            <h2
              style={{
                color: "#7c3aed",
                fontSize: "40px"
              }}
            >
              {profile.stats.total_bookings}
            </h2>

            <p>Total Bookings</p>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                color: "#10b981",
                fontSize: "40px"
              }}
            >
              ₹
              {profile.stats.total_spent}
            </h2>

            <p>Total Spent</p>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                color: "#16a34a",
                fontSize: "40px"
              }}
            >
              ✓
            </h2>

            <p>Verified User</p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </>
);
}
const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow:
    "0 10px 25px rgba(0,0,0,.08)"
};
const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  boxSizing: "border-box"
};
export default Profile;