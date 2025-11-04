import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
  }) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      title,
      description,
      variant,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getToastStyles = (variant) => {
    const baseStyles = "w-80 p-4 rounded-xl shadow-lg border border-border";

    const variants = {
      default: "bg-card text-foreground",
      destructive: "bg-destructive text-foreground",
      success: "bg-card text-foreground",
      warning: "bg-card text-foreground",
      info: "bg-card text-foreground",
    };

    return `${baseStyles} ${variants[variant] || variants.default}`;
  };

  const getIcon = (variant) => {
    const icons = {
      default: (
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <span className="text-foreground text-xs font-bold">i</span>
        </div>
      ),
      destructive: (
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-destructive">
          <span className="text-foreground text-xs font-bold">X</span>
        </div>
      ),
      success: (
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary">
          <span className="text-foreground text-xs font-bold">✓</span>
        </div>
      ),
      warning: (
        <div className="w-6 h-6 rounded-full flex items-center justify-center bg-accent">
          <span className="text-foreground text-xs font-bold">!</span>
        </div>
      ),
      info: (
        <div className="w-6 h-6 rounded-full bg-ring flex items-center justify-center">
          <span className="text-foreground text-xs font-bold">i</span>
        </div>
      ),
    };

    return icons[variant] || icons.default;
  };

  const getBoxShadow = (variant) => {
    const shadows = {
      default: "shadow-lg",
      destructive: "shadow-lg",
      success: "shadow-lg",
      warning: "shadow-lg",
      info: "shadow-lg",
    };

    // Apply the specific shadow color (18,29,23) for all variants
    return `${shadows[variant] || shadows.default}`;
  };

  // Progress bar component with CSS animation
  const ProgressBar = ({ variant, duration }) => {
    const getProgressColor = (variant) => {
      const colors = {
        destructive: "var(--destructive)",
        success: "var(--primary)",
        warning: "var(--accent)",
        info: "var(--ring)",
        default: "var(--muted-foreground)",
      };

      return colors[variant] || colors.default;
    };

    return (
      <div className="mt-3 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: getProgressColor(variant),
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}

      {/* Global Toast Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-100 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.variant)}
              ${getBoxShadow(toast.variant)}
              animate-in slide-in-from-right-full 
              fade-in-0 zoom-in-95 
              duration-300 pointer-events-auto
              transform transition-all
              relative
            `}
            style={{
              boxShadow:
                "0 10px 15px -3px rgba(18, 29, 23, 0.3), 0 4px 6px -2px rgba(18, 29, 23, 0.2)",
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon - Centered vertically */}
              <div className="shrink-0 flex items-center justify-center h-full rela shadow-white top-0">
                {getIcon(toast.variant)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight wrap-break-word text-foreground">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-sm mt-1 leading-relaxed wrap-break-word text-muted-foreground">
                    {toast.description}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center 
                         hover:bg-white/20 transition-colors duration-200 
                         text-gray-300 hover:text-white ml-1"
              >
                ×
              </button>
            </div>

            {/* Progress Bar */}
            <ProgressBar variant={toast.variant} duration={5000} />
          </div>
        ))}
      </div>

      {/* Add CSS animation to your global CSS file or index.css */}
      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
