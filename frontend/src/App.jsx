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

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/server"> */}
        <Route path="/server/upload-image" element={<ServerFileUpload />} />
        {/* </Route> */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path=""
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="clubs"
            element={
              <ProtectedRoute>
                <Clubs />
              </ProtectedRoute>
            }
          />
          <Route
            path="players"
            element={
              <ProtectedRoute>
                <Players />
              </ProtectedRoute>
            }
          />
          <Route
            path="matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Error pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
