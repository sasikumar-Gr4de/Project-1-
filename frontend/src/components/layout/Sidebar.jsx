import React from "react";
import {
  Home,
  Trophy,
  Users,
  User,
  BarChart3,
  Video,
  PlayCircle,
  MessageSquare,
  Folder,
  FileText,
  PieChart,
  TrendingUp,
  Circle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuGroups = [
    {
      name: "Dashboard",
      items: [
        { name: "Home", icon: Home, href: "/home" },
        { name: "Overview", icon: BarChart3, href: "/overview" },
      ],
    },
    {
      name: "Football Management",
      items: [
        {
          name: "Matches",
          icon: Trophy,
          href: "/dashboard/matches",
          key: "matches",
        },
        { name: "Clubs", icon: Users, href: "/dashboard/clubs", key: "clubs" },
        {
          name: "Players",
          icon: User,
          href: "/dashboard/players",
          key: "players",
        },
      ],
    },
    {
      name: "Tools",
      items: [
        { name: "SenseVS", icon: Video, href: "/sensevs" },
        { name: "Playlist", icon: PlayCircle, href: "/playlist" },
        { name: "Feedback", icon: MessageSquare, href: "/feedback" },
        { name: "File Manager", icon: Folder, href: "/files" },
      ],
    },
    {
      name: "Analytics",
      items: [
        { name: "Reports", icon: FileText, href: "/reports" },
        { name: "Statistics", icon: PieChart, href: "/statistics" },
        { name: "Performance", icon: TrendingUp, href: "/performance" },
      ],
    },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              {group.name}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon
                          className={`w-4 h-4 ${
                            isActive
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-accent/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
            <span className="text-xs font-medium text-foreground">
              System Online
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            All services are running smoothly
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
