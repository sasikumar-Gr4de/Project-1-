// src/components/layout/Layout.jsx
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";
import { Outlet } from "react-router-dom";

const Layout = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when clicking on overlay or navigating on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Fixed */}
      <Header onMenuToggle={handleMenuToggle} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        {/* Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={handleSidebarClose}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-40
            w-64 bg-card border-r border-border
            transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:static
          `}
        >
          <div className="h-full overflow-y-auto">
            <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
          </div>
        </div>

        {/* Content Area with Footer at Bottom */}
        <div className="flex-1 flex flex-col min-h-0 w-full">
          {/* Scrollable Content Area - Takes all available space */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 min-h-full">
              <Outlet />
            </div>
          </main>

          {/* Footer - Always at bottom */}
          <div className="shrink-0 border-t border-border">
            <Footer />
          </div>
        </div>
      </div>

      {/* Chatbot Integration */}
      <Chatbot />
    </div>
  );
};

export default Layout;
