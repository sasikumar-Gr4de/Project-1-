import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { NAV_ITEMS } from "@/utils/constants";
import {
  LayoutDashboard,
  Users,
  Clock,
  FileText,
  Settings,
  Menu,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { mobileMenuOpen, toggleMobileMenu } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = NAV_ITEMS.ADMIN;

  const getIcon = (iconName) => {
    const icons = {
      LayoutDashboard,
      Users,
      Clock,
      FileText,
      Settings,
    };
    const IconComponent = icons[iconName] || LayoutDashboard;
    return <IconComponent className="w-5 h-5" />;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="bg-card border-border"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed && "lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed && "justify-center w-full"
              )}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  G4
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  <span className="text-xl font-bold text-foreground">
                    GR4DE
                  </span>
                  <span className="text-xs text-muted-foreground ml-2 block">
                    Admin
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            {isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                {getIcon(item.icon)}
                {!isCollapsed && <span>{item.name}</span>}
              </a>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            <div
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "space-x-3"
              )}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-medium">
                  {user?.player_name?.charAt(0) || "A"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.player_name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full mt-3 justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-200",
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </div>
  );
};

export default AdminLayout;
