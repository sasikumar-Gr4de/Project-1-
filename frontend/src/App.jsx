import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

import Landing from "@/pages/Landing";
import Unauthorized from "@/pages/Error/Unauthorized";
import NotFound from "@/pages/Error/NotFoundPage";
import { ToastProvider } from "@/contexts/ToastContext";
import ServerFileUpload from "@/pages/Developer/ServerFileUpload";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/server/upload-image" element={<ServerFileUpload />} />
          <Route path="/" element={<Landing />} />

          {/* Error pages */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
