import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const VerificationBadge = ({ status, label, size = "default" }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "bg-linear-to-r from-green-500 to-emerald-600 text-white",
          iconColor: "text-white",
        };
      case "pending":
        return {
          icon: Clock,
          color: "bg-linear-to-r from-yellow-500 to-amber-600 text-white",
          iconColor: "text-white",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "bg-linear-to-r from-red-500 to-rose-600 text-white",
          iconColor: "text-white",
        };
      default:
        return {
          icon: AlertCircle,
          color: "bg-[#343434] text-[#B0AFAF]",
          iconColor: "text-[#B0AFAF]",
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base",
  };

  return (
    <Badge
      className={`${config.color} ${sizeClasses[size]} font-semibold border-0`}
    >
      <div className="flex items-center space-x-1">
        <IconComponent className={`w-3 h-3 ${config.iconColor}`} />
        <span>{label}</span>
      </div>
    </Badge>
  );
};

export default VerificationBadge;
