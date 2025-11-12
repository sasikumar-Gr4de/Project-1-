import React from "react";
import { Progress } from "@/components/ui/progress";

const ProgressBarChart = ({ data = [], className = "", barHeight = "h-3" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white font-medium">{item.label}</span>
            <span className="text-placeholder">{item.value}</span>
          </div>
          <Progress
            value={item.value}
            className={`${barHeight} ${item.color} rounded-full`}
          />
        </div>
      ))}
    </div>
  );
};

export default ProgressBarChart;
