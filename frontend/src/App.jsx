import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import "@/App.css";

import { useAuthStore } from "@/store/authStore";
import { ROUTES, isPublicRoute } from "@/utils/routes.config";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import RoleProtectedRoute from "@/components/common/RoleProtectedRoute";

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

// Other Pages
import Landing from "@/pages/Landing";
import Unauthorized from "@/pages/Error/Unauthorized";
import NotFoundPage from "@/pages/Error/NotFoundPage";
import ServerFileUpload from "@/pages/Developer/ServerFileUpload";
import { ToastProvider } from "@/contexts/ToastContext";

function App() {
  const { isAuthenticated, user, isInitialized, initializeAuth } =
    useAuthStore();

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Show loading while initializing
  if (!isInitialized) {
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

  // Determine default route based on authentication and user role
  const getDefaultRoute = () => {
    if (!isAuthenticated) return ROUTES.LANDING;
    if (user?.requires_onboarding || !user?.player_name)
      return ROUTES.ONBOARDING;
    return user?.role === "admin" ? ROUTES.ADMIN_DASHBOARD : ROUTES.DASHBOARD;
  };

  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LANDING} element={<Landing />} />
          <Route
            path={ROUTES.LOGIN}
            element={
              isAuthenticated ? (
                <Navigate to={getDefaultRoute()} replace />
              ) : (
                <Login />
              )
            }
          />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
          <Route path={ROUTES.SERVER_UPLOAD} element={<ServerFileUpload />} />

          {/* Protected Routes with Layout */}
          <Route
            path={ROUTES.ONBOARDING}
            element={
              <ProtectedRoute requireOnboarding={true}>
                <Layout>
                  <Onboarding />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Player Routes */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player", "admin"]}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.UPLOAD}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player"]}>
                  <Layout>
                    <Upload />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.REPORTS}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player"]}>
                  <Layout>
                    <Reports />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.REPORT_DETAIL}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player"]}>
                  <Layout>
                    <ReportDetail />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.BENCHMARKS}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player"]}>
                  <Layout>
                    <Benchmarks />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["player", "admin"]}>
                  <Layout>
                    <Profile />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={["admin"]}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
