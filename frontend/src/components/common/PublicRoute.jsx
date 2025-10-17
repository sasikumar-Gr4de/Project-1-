import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
