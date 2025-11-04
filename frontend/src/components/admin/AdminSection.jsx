import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminSection = ({
  title,
  description,
  children,
  action,
  actionText,
  onAction,
  className,
  icon: Icon,
  variant = "default",
}) => {
  const headerStyles = {
    default: "border-[#343434]",
    primary: "border-primary/20",
    success: "border-[#10B981]/20",
    warning: "border-[#F59E0B]/20",
  };

  return (
    <Card
      className={cn(
        "bg-[#262626] border-[#343434] transition-all duration-300",
        className
      )}
    >
      <CardHeader className={cn("border-b", headerStyles[variant])}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  variant === "default"
                    ? "bg-linear-to-br from-primary to-[#94D44A] text-[#0F0F0E]"
                    : "bg-[#343434] text-white"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-xl font-bold text-white">
                {title}
              </CardTitle>
              {description && (
                <p className="text-[#B0AFAF] text-sm mt-1">{description}</p>
              )}
            </div>
          </div>
          {action && onAction && (
            <Button
              onClick={onAction}
              className="bg-linear-to-r from-primary to-[#94D44A] text-[#0F0F0E] hover:from-[#94D44A] hover:to-primary font-semibold"
            >
              {actionText}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-6 pr-6 pt-2">{children}</CardContent>
    </Card>
  );
};

export default AdminSection;
