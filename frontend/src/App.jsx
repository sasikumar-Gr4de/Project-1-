import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import Login from "@/pages/Auth/Login.jsx";
import Register from "@/pages/Auth/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Welcome to GR4DE</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
