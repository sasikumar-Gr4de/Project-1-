// App.jsx - Professional routing configuration
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import "@/App.css";

import { useAuthStore } from "@/store/authStore";
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
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/Admin/Dashboard";
import QueueManagement from "@/pages/Admin/QueueManagement";
import UserManagement from "@/pages/Admin/UserManagement";
import ReportManagement from "@/pages/Admin/ReportManagement";
import ContentManager from "@/pages/Admin/ContentManager";
import SystemAnalytics from "@/pages/Admin/SystemAnalytics";

// Other Pages
import Landing from "@/pages/Landing";
import ServerFileUpload from "@/pages/Developer/ServerFileUpload";
import SubscriptionPlans from "@/pages/Subscription/SubscriptionPlans";
import SubscriptionSuccess from "@/pages/Subscription/SubscriptionSuccess";
import Unauthorized from "@/pages/Error/Unauthorized";
import NotFoundPage from "@/pages/Error/NotFoundPage";

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

  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/server-upload" element={<ServerFileUpload />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />
          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route
            path="/subscription/success"
            element={<SubscriptionSuccess />}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Onboarding Route - Special handling */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Player Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute
                  allowedRoles={["player", "admin"]}
                  fallbackPath="/unauthorized"
                >
                  <PlayerRoutes />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute
                  allowedRoles={["admin"]}
                  fallbackPath="/unauthorized"
                >
                  <AdminRoutes />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

// Player Routes Component
function PlayerRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:reportId" element={<ReportDetail />} />
        <Route path="/benchmarks" element={<Benchmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

// Admin Routes Component
function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/queue" element={<QueueManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<ReportManagement />} />
        <Route path="/content" element={<ContentManager />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default App;
