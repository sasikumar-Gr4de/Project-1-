import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@/App.css";

import { useAuthStore } from "@/store/auth.store";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import PublicRoute from "@/components/common/PublicRoute";

// Error Pages
import NotFound from "@/pages/Error/NotFound";
import Unauthorized from "@/pages/Error/Unauthorized";

import Landing from "@/pages/Home";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";

import Dashboard from "@/pages/dashboard/Dashboard";

import VerifyEmail from "@/pages/Auth/VerifyEmail";
import ToastContainer from "@/components/common/ToastContainer";
import Layout from "@/components/layouts/Layout";
import Matches from "@/pages/matches/Matches";
import Players from "@/pages/players/Players";
import PlayerDetail from "@/pages/players/PlayerDetail";
import Teams from "@/pages/teams/Teams";
import Tournaments from "@/pages/tournaments/Tournaments";
import TeamDetail from "@/pages/teams/TeamDetail";
import MatchDetail from "@/pages/matches/MatchDetail";
import FileManager from "./pages/FileManager/FileManager";

import useNavigationLoading from "@/hooks/useNavigationLoading";

// Create a wrapper component that uses the navigation hook
function AppContent() {
  const { initializeAuth, isLoading } = useAuthStore();

  // Use the navigation loading hook
  useNavigationLoading();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Initial loading screen handling
  useEffect(() => {
    const loadingScreen = document.querySelector(".gr4de-loading-screen");

    // Hide initial loading screen when auth is initialized
    if (loadingScreen && !isLoading) {
      const timer = setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route exact path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/tournaments" element={<Tournaments />} />
          {/* <Route path="/data-management" element={<FileManager />} /> */}
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
