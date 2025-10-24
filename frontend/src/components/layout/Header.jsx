import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Menu,
  Trophy,
  Users,
  User,
  BarChart3,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuthstore } from "@/store/auth.store";

const Header = ({ onMenuToggle }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const { user, logout } = useAuthstore();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "New match added",
      message: "Barcelona vs Real Madrid match was added",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Player update",
      message: "Player stats updated for Luka Rodriguez",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "System update",
      message: "Platform updated to version 1.2.0",
      time: "2 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-full">
        {/* Left Section - Menu Button and Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden h-9 w-9 flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3 min-w-0">
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground truncate">
                GR4DE Platform
              </h1>
            </div>
            <div className="sm:hidden">
              <h1 className="text-lg font-bold text-foreground truncate">
                GR4DE
              </h1>
            </div>
          </div>
        </div>

        {/* Right Section - User Menu and Notifications */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative h-9 w-9"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 sm:p-4 border-b border-border hover:bg-accent cursor-pointer transition-colors ${
                        !notification.read ? "bg-accent/50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-foreground text-sm flex-1 min-w-0">
                          <span className="truncate">{notification.title}</span>
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Mark all as read
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-1 sm:p-2 h-auto min-w-0"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="flex items-center space-x-2 min-w-0">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div className="hidden sm:block text-left min-w-0 max-w-[120px]">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.role}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-3 sm:p-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="p-1">
                  {[
                    { name: "Profile", icon: User },
                    { name: "Settings", icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.name}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
                <div className="p-1 border-t border-border">
                  <button
                    className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    onClick={() => logout()}
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
