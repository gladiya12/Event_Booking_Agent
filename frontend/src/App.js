import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;