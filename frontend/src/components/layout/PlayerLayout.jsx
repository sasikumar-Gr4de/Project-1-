// PlayerLayout.jsx - Updated with Figma Header Design
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import {
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  Settings,
  User,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/constants";

const PlayerLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  // Navigation items based on Figma design
  const navigation = NAV_ITEMS.PLAYER;

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu")) {
        setUserMenuOpen(false);
      }
      if (notificationsOpen && !event.target.closest(".notifications-menu")) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen, notificationsOpen]);

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  };

  const isActiveRoute = (href) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Performance Report Ready",
      message: "Your latest match analysis is now available",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      title: "New Benchmark Data",
      message: "Updated peer comparisons for your position",
      time: "1 hour ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-[#0F0F0E] border-border h-10 w-10 hover:bg-primary/10 hover:border-primary/30 transition-colors"
        >
          <Menu className="w-4 h-4 text-primary" />
        </Button>
      </div>

      {/* Sidebar - Fixed with Figma Design */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] bg-[#0F0F0E] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center p-6 border-b border-border/20">
            <img
              src="https://placehold.co/208x55"
              alt="GR4DE Logo"
              className="w-52 h-[55px]"
            />
          </div>

          {/* Navigation - Exact Figma Layout */}
          <nav className="flex-1 overflow-y-auto py-6">
            <div className="space-y-1">
              {navigation.map((item, index) => {
                const isActive = isActiveRoute(item.href);
                const topPosition = 163 + index * 65; // Exact Figma spacing

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center relative px-10 py-4 transition-all duration-200 group",
                      "hover:bg-white/5",
                      isActive && "bg-primary/10 text-primary"
                    )}
                    style={{
                      minHeight: "65px",
                      paddingLeft: "76px", // Exact Figma left position for text
                    }}
                  >
                    {/* Icon Circle - Exact Figma positioning */}
                    <div className="absolute left-10 w-6 h-6 bg-[#D9D9D9] rounded-full" />

                    {/* Navigation Text */}
                    <span
                      className={cn(
                        "text-lg font-normal font-['Inter_Tight'] transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-white group-hover:text-white/80"
                      )}
                    >
                      {item.name}
                    </span>

                    {/* Active Indicator - Gradient line like Figma */}
                    {isActive && (
                      <div className="absolute right-0 top-0 w-0.5 h-full bg-linear-to-b from-[#994444] to-primary opacity-50" />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col lg:ml-0">
        {/* Header - Fixed with Figma Design */}
        <header className="relative top-0 z-30 bg-[#0F0F0E] h-[92px] shrink-0">
          {/* Gradient Line at Bottom */}
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{
              background:
                "linear-gradient(270deg, rgba(153, 68.40, 68.40, 0.50) 0%, rgba(193, 255, 114, 0.50) 100%)",
            }}
          />

          <div className="flex items-center justify-between h-full px-8">
            {/* Left Section - Page Title */}
            <div className="flex-1">
              <h1
                className="text-white text-[20px] font-semibold font-['Inter_Tight'] leading-5"
                style={{ width: "162px" }}
              >
                {navigation.find((item) => isActiveRoute(item.href))?.name ||
                  "Overview"}
              </h1>
            </div>

            {/* Right Section - Icons & User Menu */}
            <div className="flex-1 flex justify-end items-center space-x-4">
              {/* Notifications Button - Updated Style */}
              <div className="relative notifications-menu">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative h-10 w-10 bg-[#262626] rounded-full border border-black/10 hover:bg-[#333333] transition-colors"
                >
                  {/* Custom Notification Icon */}
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center border border-[#0F0F0E]">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#262626] border border-black/10 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-black/10">
                      <h3 className="font-semibold text-white font-['Inter_Tight']">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-b border-black/10 last:border-b-0 hover:bg-[#333333] cursor-pointer transition-colors",
                            !notification.read && "bg-primary/5"
                          )}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-medium text-white text-sm flex-1 font-['Inter_Tight']">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-[#B0AFAF] whitespace-nowrap font-['Inter_Tight']">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter_Tight']">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}

              {/* User Menu */}
              <div className="relative user-menu">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-0 h-auto hover:bg-transparent"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-10 h-10 bg-[#262626] rounded-full border border-black/10 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user?.player_name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-white transition-transform duration-200",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#262626] border border-black/10 rounded-lg shadow-lg z-50">
                    {/* <div className="p-4 border-b border-black/10">
                      <p className="text-sm font-medium text-white truncate font-['Inter_Tight']">
                        {user?.player_name || "User"}
                      </p>
                      <p className="text-xs text-[#B0AFAF] mt-1 truncate font-['Inter_Tight']">
                        {user?.email}
                      </p>
                    </div> */}
                    <div className="p-2">
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[#B0AFAF] hover:text-white hover:bg-[#333333] rounded-md transition-colors font-['Inter_Tight']"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[#B0AFAF] hover:text-white hover:bg-[#333333] rounded-md transition-colors font-['Inter_Tight']"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </a>
                    </div>
                    <div className="p-2 border-t border-black/10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors font-['Inter_Tight']"
                      >
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

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="p-4 sm:p-6 lg:p-8 min-h-full">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default PlayerLayout;
