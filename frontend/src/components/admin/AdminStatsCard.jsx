import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AdminStatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
  variant = "default",
}) => {
  const variantStyles = {
    default: "bg-[#262626] border-[#343434] hover:border-primary/30",
    primary: "bg-linear-to-br from-primary/10 to-[#94D44A]/5 border-primary/20",
    success:
      "bg-linear-to-br from-[#10B981]/10 to-[#059669]/5 border-[#10B981]/20",
    warning:
      "bg-linear-to-br from-[#F59E0B]/10 to-[#D97706]/5 border-[#F59E0B]/20",
    danger:
      "bg-linear-to-br from-[#EF4444]/10 to-[#DC2626]/5 border-[#EF4444]/20",
  };

  const iconStyles = {
    default: "bg-linear-to-br from-primary to-[#94D44A] text-[#0F0F0E]",
    primary: "bg-linear-to-br from-[#60A5FA] to-[#3B82F6] text-white",
    success: "bg-linear-to-br from-[#10B981] to-[#059669] text-white",
    warning: "bg-linear-to-br from-[#F59E0B] to-[#D97706] text-white",
    danger: "bg-linear-to-br from-[#EF4444] to-[#DC2626] text-white",
  };

  return (
    <Card
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
        variantStyles[variant],
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-white">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"
                  )}
                >
                  {trend === "up" ? "↑" : "↓"} {trendValue}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-[#B0AFAF]">{subtitle}</p>}
          </div>
          {Icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                iconStyles[variant]
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatsCard;
