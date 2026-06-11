import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  return (
    <>
      <Navbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "50px auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h1>User Profile</h1>

        <p><strong>Name:</strong> Demo User</p>

        <p><strong>Email:</strong> demo@example.com</p>

        <p><strong>Role:</strong> Event Attendee</p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <Footer />
    </>
  );
}

export default Profile;