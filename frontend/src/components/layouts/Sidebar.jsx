import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  Trophy,
  PlayCircle,
  FileText,
  Target,
  Settings,
  X,
} from "lucide-react";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      path: "/dashboard",
    },
    {
      id: "players",
      label: "Players",
      icon: Users,
      path: "/players",
    },
    {
      id: "matches",
      label: "Matches",
      icon: PlayCircle,
      path: "/matches",
    },
    {
      id: "tournaments",
      label: "Tournaments",
      icon: Trophy,
      path: "/tournaments",
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      path: "/reports",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: Target,
      path: "/analytics",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-800 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Gr4de</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors
                    ${
                      activeTab === item.id
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <p className="text-sm text-gray-300 font-medium">Need help?</p>
              <p className="text-xs text-gray-400 mt-1">
                Check our documentation or contact support
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
