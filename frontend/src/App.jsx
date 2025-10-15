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
// import Players from "./pages/Players";
// import Matches from "./pages/Matches";
// import Tournaments from "./pages/Tournaments";
// import Reports from "./pages/Reports";
// import Analytics from "./pages/Analytics";
// import Settings from "./pages/Settings";

import VerifyEmail from "./pages/verify-email";
import ToastContainer from "./components/common/ToastContainer";
import Layout from "./components/layouts/Layout";

function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            // <ProtectedRoute>
            <Layout />
            // </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} /> */}
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
