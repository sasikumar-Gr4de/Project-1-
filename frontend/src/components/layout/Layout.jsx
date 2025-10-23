import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";

const Layout = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Page Content */}
          <div className="flex-1 overflow-auto p-5">
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
