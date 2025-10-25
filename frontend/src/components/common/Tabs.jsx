// components/Tabs.jsx
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Tabs = ({
  tabs = [],
  defaultTab = 0,
  onTabChange,
  orientation = "horizontal", // 'horizontal' | 'vertical'
  variant = "default", // 'default' | 'pills' | 'underline'
  size = "md", // 'sm' | 'md' | 'lg'
  fullWidth = false,
  responsive = true,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    if (!responsive) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [responsive]);

  // Update active tab when defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    setMobileOpen(false);
    onTabChange?.(index, tabs[index]);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      tab: "px-3 py-2 text-sm",
      icon: "h-3 w-3",
      gap: "gap-1",
    },
    md: {
      tab: "px-4 py-3 text-base",
      icon: "h-4 w-4",
      gap: "gap-2",
    },
    lg: {
      tab: "px-6 py-4 text-lg",
      icon: "h-5 w-5",
      gap: "gap-3",
    },
  };

  // Variant styles
  const variantStyles = {
    default: {
      tab: {
        base: "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200",
        active:
          "bg-card border-b-2 border-primary text-foreground font-semibold",
      },
      container: "border-b border-border",
    },
    pills: {
      tab: {
        base: "rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200",
        active: "bg-primary text-primary-foreground font-semibold shadow-sm",
      },
      container: "gap-2",
    },
    underline: {
      tab: {
        base: "text-muted-foreground hover:text-foreground transition-all duration-200 border-b-2 border-transparent",
        active: "text-primary border-primary font-semibold",
      },
      container: "border-b border-border/50",
    },
  };

  const config = sizeConfig[size];
  const styles = variantStyles[variant];

  if (!tabs || tabs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-card border border-border rounded-lg">
        <div className="text-center text-muted-foreground">
          <p>No tabs configured</p>
        </div>
      </div>
    );
  }

  const activeTabContent = tabs[activeTab]?.content;

  // Render icon component correctly
  const renderIcon = (iconComponent, className) => {
    if (!iconComponent) return null;

    // If it's a React component, render it with the className
    const Icon = iconComponent;
    return <Icon className={className} />;
  };

  // Mobile Dropdown
  if (isMobile && responsive) {
    return (
      <div className={`w-full ${className}`}>
        {/* Mobile Dropdown Trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`w-full ${config.tab} bg-card border border-border rounded-lg flex items-center justify-between transition-all hover:bg-muted/50`}
        >
          <div className="flex items-center gap-2">
            {renderIcon(tabs[activeTab]?.icon, config.icon)}
            <span className="font-medium">{tabs[activeTab]?.label}</span>
            {tabs[activeTab]?.badge && (
              <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                {tabs[activeTab].badge}
              </span>
            )}
          </div>
          {mobileOpen ? (
            <ChevronUp className={config.icon} />
          ) : (
            <ChevronDown className={config.icon} />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {tabs.map((tab, index) => (
              <button
                key={tab.id || index}
                onClick={() => handleTabChange(index)}
                className={`w-full text-left ${
                  config.tab
                } flex items-center justify-between transition-all ${
                  index === activeTab
                    ? "bg-primary/10 text-primary font-semibold"
                    : "hover:bg-muted/50"
                } ${
                  index !== tabs.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {renderIcon(tab.icon, config.icon)}
                  <span>{tab.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {tab.badge && (
                    <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {tab.disabled && (
                    <span className="text-xs text-muted-foreground">
                      Disabled
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tab Content */}
        {activeTabContent && (
          <div className="mt-4 animate-in fade-in duration-200">
            {activeTabContent}
          </div>
        )}
      </div>
    );
  }

  // Horizontal Tabs
  if (orientation === "horizontal") {
    return (
      <div className={`w-full ${className}`}>
        {/* Tab Headers */}
        <div
          className={`flex ${fullWidth ? "w-full" : ""} ${styles.container}`}
        >
          <div
            className={`flex ${fullWidth ? "w-full" : ""} ${config.gap} ${
              variant === "pills" ? styles.container : ""
            }`}
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.id || index}
                onClick={() => !tab.disabled && handleTabChange(index)}
                disabled={tab.disabled}
                className={`flex items-center ${config.tab} ${config.gap} ${
                  fullWidth ? "flex-1 justify-center" : ""
                } ${styles.tab.base} ${
                  index === activeTab ? styles.tab.active : ""
                } ${
                  tab.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } transition-all duration-200`}
              >
                {renderIcon(tab.icon, config.icon)}
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      index === activeTab && variant === "pills"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTabContent && (
          <div className="mt-6 animate-in fade-in duration-200">
            {activeTabContent}
          </div>
        )}
      </div>
    );
  }

  // Vertical Tabs
  return (
    <div className={`flex ${className}`}>
      {/* Vertical Tab Headers */}
      <div className="flex flex-col w-64 mr-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            onClick={() => !tab.disabled && handleTabChange(index)}
            disabled={tab.disabled}
            className={`flex items-center ${config.tab} ${config.gap} ${
              styles.tab.base
            } ${
              index === activeTab
                ? "bg-card border-r-2 border-primary text-foreground font-semibold"
                : ""
            } ${
              tab.disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-muted/50"
            } transition-all duration-200 text-left ${
              index !== tabs.length - 1 ? "border-b border-border/50" : ""
            }`}
          >
            {renderIcon(tab.icon, config.icon)}
            <span className="flex-1">{tab.label}</span>
            {tab.badge && (
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  index === activeTab
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vertical Tab Content */}
      {activeTabContent && (
        <div className="flex-1 animate-in fade-in duration-200">
          {activeTabContent}
        </div>
      )}
    </div>
  );
};

export default Tabs;
