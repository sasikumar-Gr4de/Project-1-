// components/ui/toast.jsx
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

const Toast = ({ toast }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  // Auto remove on duration
  useEffect(() => {
    if (toast.duration === 0) return;

    const timer = setTimeout(() => {
      handleClose();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id]);

  const getToastConfig = (type) => {
    const config = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50 border-green-200",
        iconColor: "text-green-500",
        textColor: "text-green-800",
        progressColor: "bg-green-500",
      },
      error: {
        icon: XCircle,
        bgColor: "bg-red-50 border-red-200",
        iconColor: "text-red-500",
        textColor: "text-red-800",
        progressColor: "bg-red-500",
      },
      warning: {
        icon: AlertCircle,
        bgColor: "bg-yellow-50 border-yellow-200",
        iconColor: "text-yellow-500",
        textColor: "text-yellow-800",
        progressColor: "bg-yellow-500",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50 border-blue-200",
        iconColor: "text-blue-500",
        textColor: "text-blue-800",
        progressColor: "bg-blue-500",
      },
    };
    return config[type] || config.info;
  };

  const {
    icon: Icon,
    bgColor,
    iconColor,
    textColor,
    progressColor,
  } = getToastConfig(toast.type);

  return (
    <div
      className={`
        relative max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto 
        border transform transition-all duration-300 ease-in-out
        ${bgColor} 
        ${
          isLeaving
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100"
        }
      `}
    >
      {/* Progress Bar */}
      {toast.duration !== 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-lg">
          <div
            className={`h-full rounded-t-lg transition-all duration-linear ${progressColor}`}
            style={{
              animation: `shrink ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${textColor}`}>
              {toast.message}
            </p>
            {toast.description && (
              <p className="mt-1 text-sm text-gray-600">{toast.description}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className={`
                inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 
                transition-colors duration-200
                ${textColor} focus:ring-current hover:opacity-70
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
