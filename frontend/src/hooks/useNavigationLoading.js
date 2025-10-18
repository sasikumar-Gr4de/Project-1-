import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Navigation loading hook
const useNavigationLoading = () => {
  const location = useLocation();

  useEffect(() => {
    // Show loading screen when route changes
    const loadingScreen = document.querySelector(".gr4de-loading-screen");
    if (loadingScreen) {
      loadingScreen.style.display = "flex";
      loadingScreen.style.opacity = "1";
      loadingScreen.style.zIndex = "9999";
    }

    // Hide loading screen after route is loaded
    const timer = setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [location]);
};

export default useNavigationLoading;
