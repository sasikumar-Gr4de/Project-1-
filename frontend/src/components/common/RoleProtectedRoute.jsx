// components/common/RoleProtectedRoute.jsx - Professional version
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
import Unauthorized from "@/pages/Error/Unauthorized";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Protects routes based on user roles
 * @param {Object} props
 * @param {ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed role names
 * @param {string} props.fallbackPath - Path to redirect to if unauthorized, or "/unauthorized" for Unauthorized component
 * @param {boolean} props.showLoading - Whether to show loading spinner while checking
 */
const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = "/unauthorized",
  showLoading = false,
}) => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while initializing
  if (!isInitialized && showLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const hasRequiredRole = user?.role && allowedRoles.includes(user.role);

  if (!hasRequiredRole) {
    // Log unauthorized access attempt
    console.warn(
      `Unauthorized access attempt by user ${user?.id} with role ${
        user?.role
      }. Required roles: ${allowedRoles.join(", ")}`
    );

    return fallbackPath === "/unauthorized" ? (
      <Unauthorized />
    ) : (
      <Navigate to={fallbackPath} replace />
    );
  }

  return children;
};

export default RoleProtectedRoute;
