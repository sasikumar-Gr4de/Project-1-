// src/App.jsx
import { useEffect } from "react";
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
import Landing from "@/pages/Landing";
import ServerFileUpload from "@/pages/Assist/ServerFileUpload";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Unauthorized from "@/pages/Error/Unauthorized";
import NotFound from "@/pages/Error/NotFoundPage";
import MatchDetail from "@/pages/Matches/MatchDetail";
import PlayerDetail from "@/pages/Players/PlayerDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/server/upload-image" element={<ServerFileUpload />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="players" element={<Players />} />
          <Route path="matches" element={<Matches />} />
        </Route>

        <Route
          path="/matches/:id"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MatchDetail />} />
        </Route>

        <Route
          path="/players/:id"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PlayerDetail />} />
        </Route>

        {/* Error pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
