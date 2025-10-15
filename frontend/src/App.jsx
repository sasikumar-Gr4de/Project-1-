import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import { useAuthStore } from "./store/authStore";

import ProtectedRoute from "./components/common/ProtectedRoute";

// Error Pages
import NotFound from "./pages/errors/NotFound";
import Unauthorized from "./pages/errors/Unauthorized";

import Landing from "./pages";
import Login from "./pages/login";
import Register from "./pages/register";

import Dashboard from "./pages/dashboard/Dashboard";
import VerifyEmail from "./pages/verify-email";
import ToastContainer from "./components/common/ToastContainer";

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Remove loading screen once app is ready
  useEffect(() => {
    const loadingScreen = document.querySelector(".loading-screen");
    if (loadingScreen && !isLoading) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => loadingScreen.remove(), 300);
      }, 500);
    }
  }, [isLoading]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          exact
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Define your application routes here */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
