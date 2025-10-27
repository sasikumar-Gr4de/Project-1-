import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chat/Chatbot";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices with proper breakpoint handling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Close sidebar when switching to mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [sidebarOpen]);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [sidebarOpen, isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Header - Always on top */}
      <Header onMenuToggle={handleMenuToggle} />

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile Overlay - Fixed positioning to cover entire screen */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in fade-in-0"
            onClick={handleSidebarClose}
            style={{
              top: "56px", // Height of header on mobile
              height: "calc(100vh - 56px)", // Remaining viewport height
            }}
          />
        )}

        {/* Sidebar - Fixed for mobile, static for desktop */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border 
            transform transition-transform duration-300 ease-in-out 
            lg:translate-x-0 lg:static lg:z-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            shadow-xl lg:shadow-none
          `}
          style={{
            top: "56px", // Below header on mobile
            height: "calc(100vh - 56px)", // Remaining viewport height
          }}
        >
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-0 transition-all duration-300 flex flex-col">
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <div className="p-3 sm:p-4 lg:p-6 min-h-full">
                <Outlet />
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Layout;
