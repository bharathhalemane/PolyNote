import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Home/Home.jsx";

function App() {
  return (
    <div>
      {/* <nav>
        <Link to="/signup">Signup</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav> */}

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
