import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header - Fixed */}
      <Header onMenuToggle={handleMenuToggle} />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
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
            fixed md:static inset-y-0 left-0 z-50
            w-64 bg-card border-r border-border
            transform transition-transform duration-300 ease-in-out
            h-[calc(100vh-4rem)] mt-16 md:mt-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:z-auto
          `}
        >
          <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
        </div>

        {/* Content Area with Footer at Bottom */}
        <div className="flex-1 flex flex-col min-h-0 w-full">
          {/* Scrollable Content Area - Takes all available space */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 min-h-full">
              <Outlet />
            </div>
          </div>

          {/* Footer - Always at bottom */}
          <div className="shrink-0 border-t border-border">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
