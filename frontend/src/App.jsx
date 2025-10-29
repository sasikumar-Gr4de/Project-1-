import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom"; // Add this import
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
import NotFoundPage from "@/pages/Error/NotFoundPage";
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
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes - Use AuthLayout */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={user?.role === "admin" ? "/admin" : "/dashboard"}
                />
              ) : (
                // <Layout>
                <Login />
                // </Layout>
              )
            }
          />

          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected Routes - Use Layout */}
          {isAuthenticated ? (
            <>
              {/* Onboarding */}
              {requiresOnboarding ? (
                <Route
                  path="*"
                  element={
                    <Layout>
                      <Onboarding />
                    </Layout>
                  }
                />
              ) : (
                <>
                  {/* Player Routes */}
                  {user?.role !== "admin" && (
                    <>
                      <Route
                        path="/dashboard"
                        element={
                          <Layout>
                            <Dashboard />
                          </Layout>
                        }
                      />
                      <Route
                        path="/upload"
                        element={
                          <Layout>
                            <Upload />
                          </Layout>
                        }
                      />
                      <Route
                        path="/reports"
                        element={
                          <Layout>
                            <Reports />
                          </Layout>
                        }
                      />
                      <Route
                        path="/reports/:reportId"
                        element={
                          <Layout>
                            <ReportDetail />
                          </Layout>
                        }
                      />
                      <Route
                        path="/benchmarks"
                        element={
                          <Layout>
                            <Benchmarks />
                          </Layout>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <Layout>
                            <Profile />
                          </Layout>
                        }
                      />
                    </>
                  )}

                  {/* Admin Routes */}
                  {user?.role === "admin" && (
                    <>
                      <Route
                        path="/admin"
                        element={
                          <Layout>
                            <AdminDashboard />
                          </Layout>
                        }
                      />
                      <Route
                        path="/admin/dashboard"
                        element={
                          <Layout>
                            <AdminDashboard />
                          </Layout>
                        }
                      />
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
            </>
          ) : (
            /* Redirect unauthenticated users trying to access protected routes */
            <Route path="*" element={<Navigate to="/" />} />
          )}

          {/* Developer Route */}
          <Route path="/server/upload-image" element={<ServerFileUpload />} />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
