import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";

// // Hide loading screen once React is ready to render
// const hideLoadingScreen = () => {
//   if (window.hideGr4deLoadingScreen) {
//     window.hideGr4deLoadingScreen();
//   } else {
//     // Fallback
//     const loadingScreen = document.querySelector(".gr4de-loading-screen");
//     if (loadingScreen) {
//       loadingScreen.style.opacity = "0";
//       setTimeout(() => {
//         loadingScreen.style.display = "none";
//       }, 500);
//     }
//   }
// };

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Hide loading screen after React is mounted
// setTimeout(hideLoadingScreen, 100);
