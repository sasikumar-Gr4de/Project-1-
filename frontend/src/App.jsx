import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

// Auth Pages
import Login from "@/pages/Auth/Login.jsx";
import Register from "@/pages/Auth/Register.jsx";
import VerifyEmail from "@/pages/Auth/VerifyEmail";

// Layout
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Dashboards/Home";
import Clubs from "@/pages/Dashboards/Clubs/Clubs";
import Matches from "@/pages/Dashboards/Matches/Matches";
import Players from "@/pages/Dashboards/Players/Players";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<h1>Welcome to GR4DE</h1>} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="players" element={<Players />} />
          <Route path="matches" element={<Matches />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
