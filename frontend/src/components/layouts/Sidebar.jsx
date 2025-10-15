import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Trophy,
  PlayCircle,
  FileText,
  Target,
  Settings,
  X,
  HelpCircle,
  Shield,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

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

  const isActive = (path) => {
    return location.pathname === path || activeTab === path.split("/")[1];
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed positioning */}
      <aside
        className={`
        fixed top-0 left-0 h-screen z-40
        w-64 bg-gray-800/80 backdrop-blur-md border-r border-gray-700/50
        transform transition-transform duration-300 ease-in-out
        flex flex-col shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Added pt-16 for header space */}
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group backdrop-blur-sm
                    ${
                      active
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30 shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50 border border-transparent"
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      active ? "scale-110" : "group-hover:scale-105"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Need help?</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Check our documentation or contact support
                  </p>
                  <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Get Help →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
