import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const PublicRoute = ({ children }) => {
  const { user, email_verified } = useAuthStore();

  if (user && email_verified == false) {
    return <Navigate to="/verify-email" replace />;
  }
  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
