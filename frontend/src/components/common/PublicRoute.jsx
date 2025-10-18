import { useNavigate, replace } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
  const { user, email_verified } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logic on mount
    if (user && email_verified == false) {
      navigate("/verify-email", { replace: true });
    } else if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, email_verified, navigate]);

  return children;
};

export default PublicRoute;
