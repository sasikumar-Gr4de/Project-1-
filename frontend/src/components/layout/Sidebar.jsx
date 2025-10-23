import React from "react";
import { Button } from "../ui/button";
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
  X,
  Circle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menuGroups = [
    {
      name: "Dashboard",
      items: [
        { name: "Home", icon: Home, href: "/" },
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
          badge: 12,
        },
        { name: "Clubs", icon: Users, href: "/dashboard/clubs", badge: 8 },
        { name: "Players", icon: User, href: "/dashboard/players", badge: 45 },
      ],
    },
    {
      name: "Tools",
      items: [
        { name: "SenseVS", icon: Video, href: "/sensevs" },
        { name: "Playlist", icon: PlayCircle, href: "/playlist" },
        { name: "Feedback", icon: MessageSquare, href: "/feedback" },
        { name: "File Manager", icon: Folder, href: "/files", badge: 23 },
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:z-auto
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          {/* <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <img src="/GR4DE.png" alt="GR4DE" className="h-8 w-8" />
              <span className="font-bold text-foreground">GR4DE</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-8">
            {menuGroups.map((group) => (
              <div key={group.name}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {group.name}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                          ${
                            location.pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary p-1 rounded-sm">
                            <item.icon className="w-4 h-4 text-secondary-foreground" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                        {/* {item.badge && (
                          <span
                            className={`
                            px-2 py-1 text-xs rounded-full
                            ${
                              item.active
                                ? "bg-primary-foreground text-primary"
                                : "bg-primary text-primary-foreground"
                            }
                          `}
                          >
                            {item.badge}
                          </span>
                        )} */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className="bg-accent/50 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-2">
                <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
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
      </div>
    </>
  );
};

export default Sidebar;
