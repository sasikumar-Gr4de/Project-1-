import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "@/App.css";

import { useAuthStore } from "@/store/authStore";
import Layout from "@/components/layout/Layout";

// Auth Pages
import Login from "@/pages/Auth/Login";
import Onboarding from "@/pages/Auth/Onboarding";

// Player Pages
import Dashboard from "@/pages/Player/Dashboard";
import Upload from "@/pages/Player/Upload";
import Reports from "@/pages/Player/Reports";
import ReportDetail from "@/pages/Player/ReportDetail";
import Benchmarks from "@/pages/Player/Benchmarks";
import Profile from "@/pages/Player/Profile";

// Admin Pages
import AdminDashboard from "@/pages/Admin/Dashboard";

import Landing from "@/pages/Landing";
import Unauthorized from "@/pages/Error/Unauthorized";
import NotFound from "@/pages/Error/NotFoundPage";
import ServerFileUpload from "@/pages/Developer/ServerFileUpload";
import { ToastProvider } from "@/contexts/ToastContext";

function App() {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading GR4DE Platform...
          </p>
        </div>
      </div>
    );
  }

  // Redirect logic for onboarding
  const requiresOnboarding = isAuthenticated && user && !user.player_name;
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
              }
            />

            {/* Protected Routes */}
            {isAuthenticated && (
              <>
                {/* Onboarding */}
                {requiresOnboarding && (
                  <Route path="*" element={<Onboarding />} />
                )}

                {/* Player Routes */}
                {!requiresOnboarding && user?.role !== "admin" && (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route
                      path="/reports/:reportId"
                      element={<ReportDetail />}
                    />
                    <Route path="/benchmarks" element={<Benchmarks />} />
                    <Route path="/profile" element={<Profile />} />
                  </>
                )}

                {/* Admin Routes */}
                {!requiresOnboarding && user?.role === "admin" && (
                  <>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route
                      path="/admin/dashboard"
                      element={<AdminDashboard />}
                    />
                    {/* Add other admin routes as needed */}
                  </>
                )}

                {/* Fallback for authenticated users */}
                <Route
                  path="*"
                  element={
                    <Navigate
                      to={user?.role === "admin" ? "/admin" : "/dashboard"}
                    />
                  }
                />
              </>
            )}
            <Route path="/server/upload-image" element={<ServerFileUpload />} />
            <Route path="/" element={<Landing />} />
            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
