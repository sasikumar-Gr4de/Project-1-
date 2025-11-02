// App.jsx - Fixed routing configuration
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

import ServerFileUpload from "@/pages/Developer/ServerFileUpload";

// Other Pages
import Landing from "@/pages/Landing";
import { ToastProvider } from "@/contexts/ToastContext";
import SubscriptionPlans from "@/pages/Subscription/SubscriptionPlans";
import SubscriptionSuccess from "@/pages/Subscription/SubscriptionSuccess";
import ContentManager from "@/pages/Admin/ContentManager";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/Admin/Dashboard";
import QueueManagement from "@/pages/Admin/QueueManagement";
import UserManagement from "@/pages/Admin/UserManagement";
import ReportManagement from "@/pages/Admin/ReportManagement";
import ContentManager from "@/pages/Admin/ContentManager";
import SystemAnalytics from "@/pages/Admin/SystemAnalytics";
import RoleProtectedRoute from "@/components/common/RoleProtectedRoute";

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

          {/* Onboarding Route - Special handling */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes that require completed onboarding */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <Upload />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/:reportId"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReportDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/benchmarks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Benchmarks />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route
            path="/subscription/success"
            element={<SubscriptionSuccess />}
          />

          <Route
            path="/admin/contnet"
            element={
              <ProtectedRoute>
                <ContentManager />
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />

          <Route
            path="/admin"
            element={<RoleProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="queue" element={<QueueManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<ReportManagement />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="analytics" element={<SystemAnalytics />} />
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
