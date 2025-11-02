import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Play, XCircle, RefreshCw } from "lucide-react";

const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = {
    pending: {
      variant: "warning",
      icon: Clock,
      label: "Pending",
      color: "text-[#F59E0B]",
    },
    processing: {
      variant: "primary",
      icon: RefreshCw,
      label: "Processing",
      color: "text-primary",
    },
    completed: {
      variant: "success",
      icon: CheckCircle,
      label: "Completed",
      color: "text-[#10B981]",
    },
    failed: {
      variant: "destructive",
      icon: XCircle,
      label: "Failed",
      color: "text-[#EF4444]",
    },
    uploaded: {
      variant: "secondary",
      icon: Play,
      label: "Uploaded",
      color: "text-[#B0AFAF]",
    },
    generating: {
      variant: "primary",
      icon: RefreshCw,
      label: "Generating",
      color: "text-primary",
    },
    generated: {
      variant: "success",
      icon: CheckCircle,
      label: "Generated",
      color: "text-[#10B981]",
    },
    active: {
      variant: "success",
      icon: CheckCircle,
      label: "Active",
      color: "text-[#10B981]",
    },
    inactive: {
      variant: "secondary",
      icon: Clock,
      label: "Inactive",
      color: "text-[#B0AFAF]",
    },
    suspended: {
      variant: "destructive",
      icon: XCircle,
      label: "Suspended",
      color: "text-[#EF4444]",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant={config.variant}
      className="flex items-center space-x-1.5 w-fit"
    >
      <IconComponent className={cn(sizeClasses[size], config.color)} />
      <span>{config.label}</span>
    </Badge>
  );
};

export default StatusBadge;
