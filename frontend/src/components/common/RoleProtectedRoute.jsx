import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";
import Unauthorized from "@/pages/Error/Unauthorized";

/**
 * Protects routes based on user roles
 */
const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = "/unauthorized",
}) => {
  const { user, isAuthenticated } = useAuthStore();

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
    return fallbackPath === "/unauthorized" ? (
      <Unauthorized />
    ) : (
      <Navigate to={fallbackPath} replace />
    );
  }

  return children;
};

export default RoleProtectedRoute;
