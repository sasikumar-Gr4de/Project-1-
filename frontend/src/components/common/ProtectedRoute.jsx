// components/common/ProtectedRoute.jsx - Enhanced version
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { isAuthenticated, user, isInitialized, initializeAuth, logout } =
    useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isInitialized) {
        await initializeAuth();
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isInitialized, initializeAuth]);

  // Show loading spinner while checking authentication
  if (isChecking || !isInitialized) {
    return <LoadingSpinner />;
  }

  // Clear invalid tokens
  if (localStorage.getItem("auth-token") === null && isAuthenticated) {
    logout();
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user needs onboarding
  const needsOnboarding = user && !user.player_name;

  // If route requires onboarding but user doesn't need it, redirect to dashboard
  if (requireOnboarding && !needsOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  // If user needs onboarding but is not on onboarding page, redirect to onboarding
  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If user doesn't need onboarding but is on onboarding page, redirect to dashboard
  if (!needsOnboarding && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
