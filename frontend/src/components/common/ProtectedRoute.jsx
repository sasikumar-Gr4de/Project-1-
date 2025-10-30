import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { isAuthenticated, user, isInitialized, initializeAuth } =
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to onboarding if user needs to complete profile
  if (requireOnboarding && user && !user.player_name) {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect away from onboarding if already completed
  if (location.pathname === "/onboarding" && user?.player_name) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
