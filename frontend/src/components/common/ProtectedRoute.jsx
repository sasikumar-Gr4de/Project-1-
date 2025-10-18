import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, email_verified } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate("/login");
      } else if (!email_verified) {
        navigate("/verify-email");
      }
    };
    checkAuth();
  }, [user, email_verified, navigate]);

  if (!user || !email_verified) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
