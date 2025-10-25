// src/components/common/MetricCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricCard = ({
  title,
  value,
  subtitle,
  progress,
  icon: Icon,
  trend,
  className = "",
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {Icon && <Icon className="h-4 w-4 text-muted-foreground mb-1" />}
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {value}
            </div>
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </div>
            )}
            {trend && (
              <div
                className={`text-xs mt-1 ${
                  trend > 0
                    ? "text-green-500"
                    : trend < 0
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%
              </div>
            )}
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
