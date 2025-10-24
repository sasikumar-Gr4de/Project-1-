import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    window.alert("Check");
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token");
      window.alert(!user || !token);
      if (!user || !token) {
        navigate("/login");
      } else if (!user.email_verified) {
        navigate("/verify-email");
      }
    };
    checkAuth();
  }, [user, navigate]);
  if (!user) {
  }
  return children;
};

export default ProtectedRoute;
