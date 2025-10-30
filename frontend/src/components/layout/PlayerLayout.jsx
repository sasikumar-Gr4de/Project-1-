// PlayerLayout.jsx - Completely redesigned with beautiful aesthetics
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import {
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  User,
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Target,
  Settings,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/constants";

// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    LayoutDashboard: LayoutDashboard,
    Upload: Upload,
    FileText: FileText,
    BarChart3: BarChart3,
    User: User,
    Target: Target,
  };

  return iconMap[iconName] || BarChart3;
};

const PlayerLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced navigation with dynamic icons
  const navigation = NAV_ITEMS.PLAYER.map((item) => ({
    ...item,
    iconComponent: getIconComponent(item.icon),
  }));

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [location.pathname, mobileMenuOpen, toggleMobileMenu]);

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

  const handleNavigation = (href, event) => {
    event.preventDefault();
    navigate(href);
    closeMobileMenu();
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
      read: true,
    },
    {
      id: 2,
      title: "New Benchmark Data",
      message: "Updated peer comparisons for your position",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      title: "Training Recommendations",
      message: "New personalized exercises based on your performance",
      time: "2 hours ago",
      read: false,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0F0F0E] flex">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-[#1A1A1A] border-[#343434] h-12 w-12 hover:bg-[#262626] hover:border-primary transition-all duration-300 shadow-lg"
        >
          <Menu className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* Sidebar - Beautiful Redesign */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-80 bg-[#1A1A1A] transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-[#343434]",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Centered and Enhanced */}
          <div className="flex flex-col items-center p-8 pb-6 shrink-0 border-b border-[#343434]">
            <div className="flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary to-[#94D44A] rounded-2xl shadow-lg mb-4">
              <img
                src="favicon-flat.png"
                alt="GR4DE Logo"
                className="w-10 h-10 object-contain filter brightness-0"
              />
            </div>
            <h1 className="text-2xl font-bold  font-['Inter_Tight'] bg-linear-to-r from-primary to-[#94D44A] bg-clip-text text-transparent">
              GR4DE
            </h1>
            <p className="text-sm text-[#B0AFAF] mt-2 font-['Inter_Tight']">
              Performance Analytics
            </p>
          </div>

          {/* User Profile Mini Card */}
          <div className="px-6 py-4 border-b border-[#343434]">
            <div className="flex items-center space-x-3 p-3 bg-[#262626] rounded-xl border border-[#343434]">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-full flex items-center justify-center shadow-lg">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#1A1A1A]"
                  />
                ) : (
                  <span className="text-[#0F0F0E] text-sm font-bold font-['Inter_Tight']">
                    {user?.player_name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate font-['Inter_Tight']">
                  {user?.player_name || "Player"}
                </p>
                <p className="text-primary text-xs truncate font-['Inter_Tight']">
                  {user?.position || "Football Player"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation - Enhanced with beautiful active states */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = isActiveRoute(item.href);
                const IconComponent = item.iconComponent;

                return (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavigation(item.href, e)}
                    className={cn(
                      "flex items-center w-full px-4 py-4 transition-all duration-300 group text-left rounded-2xl border-2",
                      "hover:border-primary/30 hover:bg-[#262626] hover:shadow-lg",
                      isActive
                        ? "bg-linear-to-r from-primary/10 to-[#94D44A]/5 border-primary shadow-lg shadow-primary/10"
                        : "border-transparent bg-transparent"
                    )}
                  >
                    {/* Icon Container with beautiful active state */}
                    <div
                      className={cn(
                        "w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 mr-3 shadow-md",
                        isActive
                          ? "bg-linear-to-br from-primary to-[#94D44A] text-[#0F0F0E] shadow-lg shadow-primary/25"
                          : "bg-[#262626] text-[#B0AFAF] group-hover:bg-[#343434] group-hover:text-primary"
                      )}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Navigation Text */}
                    <div className="flex-1">
                      <span
                        className={cn(
                          "text-base font-semibold font-['Inter_Tight'] transition-colors duration-300 block",
                          isActive
                            ? "text-primary"
                            : "text-white group-hover:text-primary"
                        )}
                      >
                        {item.name}
                      </span>
                      {item.description && (
                        <p
                          className={cn(
                            "text-xs mt-1 transition-colors duration-300",
                            isActive
                              ? "text-primary/70"
                              : "text-[#B0AFAF] group-hover:text-primary/70"
                          )}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Active Indicator Dot */}
                    {isActive && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-2 shadow-sm shadow-primary animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Enhanced Design */}
        <header className="sticky top-0 z-30 bg-[#1A1A1A] h-20 lg:h-24 shrink-0 border-b border-[#343434] backdrop-blur-sm ">
          {/* Gradient Accent Line */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-primary to-[#94D44A] shadow-lg shadow-primary/20" />

          <div className="flex items-center justify-between h-full px-6 lg:px-8">
            {/* Page Title */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white font-['Inter_Tight']">
                {navigation.find((item) => isActiveRoute(item.href))?.name ||
                  "Dashboard"}
              </h1>
              <p className="text-[#B0AFAF] text-sm mt-1 font-['Inter_Tight']">
                {navigation.find((item) => isActiveRoute(item.href))
                  ?.description || "Performance overview and insights"}
              </p>
            </div>

            {/* Right Section - Enhanced Icons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative notifications-menu">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative h-12 w-12 bg-[#262626] rounded-xl border border-[#343434] hover:bg-[#343434] hover:border-primary/30 transition-all duration-300 shadow-sm"
                >
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-linear-to-br from-[#FF6B6B] to-[#EE5A52] text-[10px] font-bold text-white flex items-center justify-center border-2 border-[#1A1A1A] shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-[#262626] border border-[#343434] rounded-2xl shadow-2xl z-50 backdrop-blur-sm">
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-b border-[#343434] last:border-b-0 hover:bg-[#343434] cursor-pointer transition-all duration-300 group",
                            !notification.read &&
                              "bg-primary/5 border-l-4 border-l-primary"
                          )}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white text-sm flex-1 font-['Inter_Tight'] group-hover:text-primary transition-colors">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-[#B0AFAF] mt-1 font-['Inter_Tight']">
                                {notification.message}
                              </p>
                            </div>
                            <span className="text-xs text-[#B0AFAF] whitespace-nowrap font-['Inter_Tight'] bg-[#343434] px-2 py-1 rounded-full">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu - Enhanced */}
              <div className="relative user-menu">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 p-2 h-auto hover:bg-[#262626] rounded-xl border border-[#343434] transition-all duration-300"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-[#94D44A] rounded-full flex items-center justify-center shadow-lg">
                      {user?.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#1A1A1A]"
                        />
                      ) : (
                        <span className="text-[#0F0F0E] text-sm font-bold font-['Inter_Tight']">
                          {user?.player_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-white font-medium text-sm font-['Inter_Tight']">
                        {user?.player_name || "User"}
                      </p>
                      <p className="text-primary text-xs font-['Inter_Tight']">
                        {user?.position || "Player"}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-[#B0AFAF] transition-transform duration-300",
                      userMenuOpen && "rotate-180 text-primary"
                    )}
                  />
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#262626] border border-[#343434] rounded-2xl shadow-2xl z-50 backdrop-blur-sm">
                    <div className="p-4 border-b border-[#343434]">
                      <p className="text-white font-semibold text-sm truncate font-['Inter_Tight']">
                        {user?.player_name || "User"}
                      </p>
                      <p className="text-[#B0AFAF] text-xs mt-1 truncate font-['Inter_Tight']">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="flex items-center space-x-2 w-full px-3 py-3 text-sm text-[#B0AFAF] hover:text-white hover:bg-[#343434] rounded-xl transition-all duration-300 font-['Inter_Tight']">
                        <User className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button className="flex items-center space-x-2 w-full px-3 py-3 text-sm text-[#B0AFAF] hover:text-white hover:bg-[#343434] rounded-xl transition-all duration-300 font-['Inter_Tight']">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="p-2 border-t border-[#343434]">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-3 text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 rounded-xl transition-all duration-300 font-['Inter_Tight']"
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
        <main className="flex-1 overflow-auto bg-[#0F0F0E]">
          <div className="p-6 sm:p-8 lg:p-10 min-h-full">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-500"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
};

export default PlayerLayout;
