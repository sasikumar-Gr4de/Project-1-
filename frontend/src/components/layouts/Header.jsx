import React from "react";
import { Button } from "../../components/ui/button";
import {
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Trophy,
  BarChart3,
  Users,
  PlayCircle,
  FileText,
  Target,
} from "lucide-react";

const Header = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onMenuClick,
}) => {
  const navigation = [
    { id: "overview", label: "Overview", path: "/dashboard", icon: BarChart3 },
    { id: "players", label: "Players", path: "/players", icon: Users },
    { id: "matches", label: "Matches", path: "/matches", icon: PlayCircle },
    {
      id: "tournaments",
      label: "Tournaments",
      path: "/tournaments",
      icon: Trophy,
    },
    { id: "reports", label: "Reports", path: "/reports", icon: FileText },
    { id: "analytics", label: "Analytics", path: "/analytics", icon: Target },
  ];

  return (
    <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 fixed top-0 left-0 right-0 z-50 shadow-2xl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white">Gr4de</span>
                <span className="block text-xs text-gray-400 -mt-1">
                  Football Analytics
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 ml-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {Icon && activeTab === item.id && (
                      <Icon className="h-4 w-4" />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players, matches..."
                className="pl-10 pr-4 py-2.5 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl backdrop-blur-sm transition-all"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl backdrop-blur-sm transition-all"
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-600/50">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-right">
                  <span className="block text-sm font-medium text-white">
                    Admin User
                  </span>
                  <span className="block text-xs text-gray-400">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden pb-3 border-t border-gray-700/50 mt-2 pt-3">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.id);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-sm transition-all backdrop-blur-sm ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
