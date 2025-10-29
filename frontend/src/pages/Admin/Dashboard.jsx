import React, { useState, useEffect } from "react";
import { adminAPI } from "@/services/base.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsResponse, queueResponse] = await Promise.all([
        adminAPI.getSystemMetrics(),
        adminAPI.getQueue("pending", 1, 5),
      ]);

      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }
      if (queueResponse.success) {
        setQueue(queueResponse.data.queue);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getQueueStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading system data...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered players and coaches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalReports || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Generated performance reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.queue?.pending + metrics?.queue?.processing || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending and processing jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">100%</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Processing Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Queue Items</CardTitle>
            <CardDescription>
              Latest processing jobs in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {queue.length > 0 ? (
              <div className="space-y-4">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {item.status === "pending" && (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      )}
                      {item.status === "processing" && (
                        <PlayCircle className="w-4 h-4 text-blue-500" />
                      )}
                      {item.status === "completed" && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {item.status === "failed" && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">
                          {item.player_data?.user?.player_name ||
                            "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.player_data?.match_date
                            ? new Date(
                                item.player_data.match_date
                              ).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={getQueueStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending jobs</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/admin/queue">View All Queue Items</a>
            </Button>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics</CardTitle>
            <CardDescription>
              Current system performance and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Queue Distribution</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Pending</span>
                  <span>{metrics?.queue?.pending || 0}</span>
                </div>
                <Progress
                  value={
                    (metrics?.queue?.pending / (metrics?.totalReports || 1)) *
                    100
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between text-sm">
                  <span>Processing</span>
                  <span>{metrics?.queue?.processing || 0}</span>
                </div>
                <Progress
                  value={
                    (metrics?.queue?.processing /
                      (metrics?.totalReports || 1)) *
                    100
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between text-sm">
                  <span>Completed</span>
                  <span>{metrics?.queue?.completed || 0}</span>
                </div>
                <Progress
                  value={
                    (metrics?.queue?.completed / (metrics?.totalReports || 1)) *
                    100
                  }
                  className="h-2 bg-green-100"
                />

                <div className="flex items-center justify-between text-sm">
                  <span>Failed</span>
                  <span>{metrics?.queue?.failed || 0}</span>
                </div>
                <Progress
                  value={
                    (metrics?.queue?.failed / (metrics?.totalReports || 1)) *
                    100
                  }
                  className="h-2 bg-red-100"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage users and permissions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Processing Queue</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage job processing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <h3 className="font-semibold">Reports</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage all reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
