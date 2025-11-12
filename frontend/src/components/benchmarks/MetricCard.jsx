import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
  gradient = "from-[#60A5FA] to-[#3B82F6]",
  valueColor = "text-white",
  className = "",
}) => {
  return (
    <Card
      className={`bg-[#262626] border-[#343434] hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
        <div
          className={`w-10 h-10 bg-linear-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColor}`}>{value}</div>
        <p className="text-xs text-placeholder mt-2">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
