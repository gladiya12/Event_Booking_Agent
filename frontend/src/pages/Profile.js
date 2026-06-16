import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  return (
    <>
      <Navbar />

      <div
        style={{
          background: "#f8fafc",
          minHeight: "calc(100vh - 160px)",
          padding: "50px 20px"
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px"
            }}
          >
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "42px",
                fontWeight: "bold",
                margin: "0 auto 20px auto"
              }}
            >
              G
            </div>

            <h1 style={{ color: "#1e293b" }}>
              My Profile
            </h1>

            <p style={{ color: "#64748b" }}>
              Manage your account information
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px"
            }}
          >
            <div>
              <label>Name</label>
              <input
                type="text"
                value="Gladiya"
                readOnly
                style={inputStyle}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value="user@example.com"
                readOnly
                style={inputStyle}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                type="text"
                value="+91 XXXXX XXXXX"
                readOnly
                style={inputStyle}
              />
            </div>

            <div>
              <label>City</label>
              <input
                type="text"
                value="Chennai"
                readOnly
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              gap: "15px"
            }}
          >
            <button
              style={{
                padding: "14px 25px",
                border: "none",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Edit Profile
            </button>

            <button
              style={{
                padding: "14px 25px",
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                background: "white",
                cursor: "pointer"
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  background: "#f8fafc",
  boxSizing: "border-box"
};

export default Profile;