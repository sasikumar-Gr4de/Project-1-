import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Shield } from "lucide-react";

const SystemStatus = () => {
  const systems = [
    {
      service: "API Server",
      status: "operational",
      latency: "42ms",
    },
    {
      service: "Database",
      status: "operational",
      latency: "18ms",
    },
    {
      service: "File Processing",
      status: "operational",
      latency: "156ms",
    },
    {
      service: "Report Generation",
      status: "operational",
      latency: "89ms",
    },
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2 text-green-400" />
          System Status
        </CardTitle>
        <CardDescription className="text-gray-400">
          All systems operational
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-300 truncate">
                  {system.service}
                </span>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                {system.latency}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
