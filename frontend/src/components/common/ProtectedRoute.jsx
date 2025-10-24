import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    // window.alert("Check");
    const checkAuth = async () => {
      const token = localStorage.getItem("auth-token");
      //   window.alert(!user || !token);
      if (!user || !token) {
        navigate("/login");
      } else if (!user.email_verified) {
        navigate("/verify-email");
      }
    };
    checkAuth();
  }, [user, navigate]);
  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-foreground flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 text-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;
