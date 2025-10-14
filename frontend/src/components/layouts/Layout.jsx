import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Main Content Area */}
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Banner for non-admin users */}
            {user && user.role !== "admin" && (
              <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">
                      Welcome back, {user.full_name || user.email}!
                    </h1>
                    <p className="text-blue-100 mt-1">
                      Ready to analyze today's performance data?
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-2 text-blue-200">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">System Online</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page Content */}
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-600">
                © 2025 Gr4de Football Analytics. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-2 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 text-sm"
                >
                  Privacy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 text-sm"
                >
                  Terms
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gray-500 text-sm"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
