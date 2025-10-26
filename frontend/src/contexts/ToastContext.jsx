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
    const baseStyles = "w-80 p-4 rounded-xl shadow-lg border backdrop-blur-sm";

    const variants = {
      default: "bg-white/95 border-gray-200 text-gray-900 shadow-md",
      destructive: "bg-red-50/95 border-red-200 text-red-900 shadow-md",
      success: "bg-green-50/95 border-green-200 text-green-900 shadow-md",
      warning: "bg-yellow-50/95 border-yellow-200 text-yellow-900 shadow-md",
      info: "bg-blue-50/95 border-blue-200 text-blue-900 shadow-md",
    };

    return `${baseStyles} ${variants[variant] || variants.default}`;
  };

  const getIcon = (variant) => {
    const icons = {
      default: (
        <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
          <span className="text-white text-xs">i</span>
        </div>
      ),
      destructive: (
        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      ),
      success: (
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      ),
      warning: (
        <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
          <span className="text-white text-xs">!</span>
        </div>
      ),
      info: (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-white text-xs">i</span>
        </div>
      ),
    };

    return icons[variant] || icons.default;
  };

  // Progress bar component with CSS animation
  const ProgressBar = ({ variant, duration }) => {
    return (
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className={`
            h-full rounded-full
            ${
              variant === "destructive"
                ? "bg-red-500"
                : variant === "success"
                ? "bg-green-500"
                : variant === "warning"
                ? "bg-yellow-500"
                : variant === "info"
                ? "bg-blue-500"
                : "bg-gray-500"
            }
          `}
          style={{
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
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-[100] space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.variant)}
              animate-in slide-in-from-right-full 
              fade-in-0 zoom-in-95 
              duration-300 pointer-events-auto
              transform transition-all
            `}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="shrink-0 mt-0.5">{getIcon(toast.variant)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight break-words">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-sm mt-1.5 leading-relaxed break-words text-gray-700">
                    {toast.description}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center 
                         hover:bg-black/10 transition-colors duration-200 
                         text-gray-500 hover:text-gray-700 ml-1"
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
