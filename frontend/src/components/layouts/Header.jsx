import React from "react";
import { Button } from "../../components/ui/button";
import { Search, Bell, Settings, User, Menu, X } from "lucide-react";

const DashboardHeader = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigation = [
    { id: "overview", label: "Overview" },
    { id: "players", label: "Players" },
    { id: "matches", label: "Matches" },
    { id: "tournaments", label: "Tournaments" },
    { id: "reports", label: "Reports" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Gr4de</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players, matches..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-2 pl-2 border-l border-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:block text-white text-sm font-medium">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
