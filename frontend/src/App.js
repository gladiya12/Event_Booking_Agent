import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import SeatSelection from "./pages/SeatSelection";
import BookingSuccess from "./pages/BookingSuccess";
import Payment from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/booking"
          element={<Booking />}
        />

        <Route
          path="/confirmation"
          element={<Confirmation />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/seat-selection"
          element={<SeatSelection />}
        />
        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;