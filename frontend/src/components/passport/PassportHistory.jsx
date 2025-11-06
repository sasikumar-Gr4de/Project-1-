// PassportHistory.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  FileText,
  Shield,
  TrendingUp,
  Image,
  Edit,
  Plus,
} from "lucide-react";

const PassportHistory = ({ history = [] }) => {
  const defaultHistory = [
    {
      id: 1,
      action: "profile_updated",
      description: "Updated personal information and headshot",
      actor: "Player",
      timestamp: "2024-11-20T14:30:00Z",
      icon: User,
      color: "text-blue-400",
    },
    {
      id: 2,
      action: "verification_approved",
      description: "Identity verification approved by admin",
      actor: "System Admin",
      timestamp: "2024-11-18T10:15:00Z",
      icon: Shield,
      color: "text-green-400",
    },
    {
      id: 3,
      action: "metrics_updated",
      description: "New match metrics uploaded - GR4DE Score: 88",
      actor: "Automated System",
      timestamp: "2024-11-15T16:45:00Z",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    {
      id: 4,
      action: "report_generated",
      description: "Monthly performance report generated",
      actor: "Coach",
      timestamp: "2024-11-10T09:20:00Z",
      icon: FileText,
      color: "text-orange-400",
    },
    {
      id: 5,
      action: "media_added",
      description: "Added new highlight video to portfolio",
      actor: "Player",
      timestamp: "2024-11-05T11:30:00Z",
      icon: Image,
      color: "text-pink-400",
    },
    {
      id: 6,
      action: "passport_created",
      description: "Digital Player Passport initialized",
      actor: "System",
      timestamp: "2024-10-28T08:00:00Z",
      icon: Plus,
      color: "text-primary",
    },
  ];

  const displayHistory = history.length > 0 ? history : defaultHistory;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getActionBadge = (action) => {
    const actionMap = {
      profile_updated: {
        label: "Profile Update",
        color: "bg-blue-500/20 text-blue-400",
      },
      verification_approved: {
        label: "Verification",
        color: "bg-green-500/20 text-green-400",
      },
      metrics_updated: {
        label: "Metrics",
        color: "bg-purple-500/20 text-purple-400",
      },
      report_generated: {
        label: "Report",
        color: "bg-orange-500/20 text-orange-400",
      },
      media_added: { label: "Media", color: "bg-pink-500/20 text-pink-400" },
      passport_created: {
        label: "Creation",
        color: "bg-primary/20 text-primary",
      },
    };

    return (
      actionMap[action] || {
        label: action,
        color: "bg-gray-500/20 text-gray-400",
      }
    );
  };

  return (
    <Card className="bg-[#262626] border-[#343434]">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Passport History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayHistory.map((item, index) => {
            const IconComponent = item.icon;
            const { date, time } = formatTimestamp(item.timestamp);
            const actionBadge = getActionBadge(item.action);

            return (
              <div key={item.id} className="flex space-x-4 group">
                {/* Timeline line */}
                {index !== displayHistory.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="w-0.5 h-full bg-[#343434] mt-1"></div>
                  </div>
                )}
                {index === displayHistory.length - 1 && (
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                )}

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center ${item.color}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {item.description}
                        </h4>
                        <p className="text-gray-400 text-xs">By {item.actor}</p>
                      </div>
                    </div>
                    <Badge className={actionBadge.color}>
                      {actionBadge.label}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-500 text-xs">
                    <span>{date}</span>
                    <span>•</span>
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayHistory.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No history available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportHistory;
