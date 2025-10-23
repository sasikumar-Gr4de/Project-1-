import React, { useState } from "react";
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

const Header = ({ onMenuToggle }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@gr4de.com",
    avatar: null,
    role: "Admin",
  };

  // Mock notifications
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
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left Section - Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-3">
            {/* <img src="/GR4DE.png" alt="GR4DE" className="h-8 w-8" /> */}
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">
                GR4DE Platform
              </h1>
            </div>
          </div>
        </div>

        {/* Center Section - Navigation Menu */}
        {/* <nav className="hidden md:flex items-center space-x-1">
          {[
            { name: "Matches", href: "/matches", icon: Trophy },
            { name: "Clubs", href: "/clubs", icon: Users },
            { name: "Players", href: "/players", icon: User },
            { name: "Analytics", href: "/analytics", icon: BarChart3 },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </a>
          ))}
        </nav> */}

        {/* Right Section - User Menu and Notifications */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border hover:bg-accent cursor-pointer ${
                        !notification.read ? "bg-accent/50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-foreground text-sm">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
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
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="p-2">
                  {[
                    { name: "Profile", icon: User },
                    { name: "Settings", icon: Settings },
                    { name: "Team", icon: Users },
                  ].map((item) => (
                    <button
                      key={item.name}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-border">
                  <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                    <LogOut className="w-4 h-4" />
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
