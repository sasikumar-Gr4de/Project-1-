// src/components/players/PlayerActivityField.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FootballPitch from "@/components/common/FootballPitch";
import MetricCard from "@/components/common/MetricCard";
import { Target, Move, Navigation, Zap } from "lucide-react";

const PlayerActivityField = ({ player, metrics }) => {
  if (!player) return null;

  const positionActivities = {
    activities: [
      { x: 35, y: 40, size: 10, successful: true, color: "#3b82f6" },
      { x: 45, y: 55, size: 8, successful: true, color: "#3b82f6" },
      { x: 60, y: 35, size: 12, successful: false, color: "#ef4444" },
      { x: 50, y: 45, size: 6, successful: true, color: "#3b82f6" },
      { x: 40, y: 60, size: 9, successful: true, color: "#3b82f6" },
    ],
    distribution: [
      { x: 40, y: 45, intensity: 0.9 },
      { x: 50, y: 50, intensity: 0.7 },
      { x: 55, y: 35, intensity: 0.6 },
      { x: 35, y: 55, intensity: 0.8 },
    ],
  };

  const defenseActivities = {
    activities: [
      { x: 25, y: 50, size: 11, successful: true, color: "#10b981" },
      { x: 30, y: 45, size: 7, successful: true, color: "#10b981" },
      { x: 35, y: 55, size: 9, successful: false, color: "#ef4444" },
    ],
    distribution: [
      { x: 28, y: 48, intensity: 0.8 },
      { x: 32, y: 52, intensity: 0.9 },
    ],
  };

  const attackActivities = {
    activities: [
      { x: 70, y: 40, size: 14, successful: true, color: "#f59e0b" },
      { x: 75, y: 35, size: 10, successful: true, color: "#f59e0b" },
      { x: 65, y: 45, size: 8, successful: false, color: "#ef4444" },
    ],
    distribution: [
      { x: 72, y: 38, intensity: 0.9 },
      { x: 68, y: 42, intensity: 0.7 },
    ],
  };

  const physicalActivities = {
    activities: [
      { x: 50, y: 50, size: 15, successful: true, color: "#8b5cf6" },
      { x: 45, y: 55, size: 12, successful: true, color: "#8b5cf6" },
      { x: 55, y: 45, size: 13, successful: true, color: "#8b5cf6" },
    ],
    distribution: [
      { x: 50, y: 50, intensity: 1.0 },
      { x: 48, y: 52, intensity: 0.8 },
      { x: 52, y: 48, intensity: 0.9 },
    ],
  };

  const positionStats = [
    { label: "Successful Attempts", value: "18", icon: Target, progress: 85 },
    { label: "Total Actions", value: "24", icon: Move },
    { label: "Attribute Count", value: "156", icon: Navigation },
    { label: "Special Actions", value: "12", icon: Zap },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Position Group */}
      <Card>
        <CardHeader>
          <CardTitle>Position Group Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                activities={positionActivities.activities}
                distribution={positionActivities.distribution}
                showHeatmap={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {positionStats.map((stat, index) => (
                <MetricCard
                  key={index}
                  title={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  progress={stat.progress}
                  className="text-center"
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Defense Group */}
      <Card>
        <CardHeader>
          <CardTitle>Defense Group Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                activities={defenseActivities.activities}
                distribution={defenseActivities.distribution}
                showHeatmap={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Successful Tackles"
                value="24"
                progress={80}
                className="text-center"
              />
              <MetricCard
                title="Interceptions"
                value="18"
                progress={75}
                className="text-center"
              />
              <MetricCard
                title="Clearances"
                value="12"
                progress={60}
                className="text-center"
              />
              <MetricCard
                title="Defensive Actions"
                value="54"
                progress={72}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attack Group */}
      <Card>
        <CardHeader>
          <CardTitle>Attack Group Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                activities={attackActivities.activities}
                distribution={attackActivities.distribution}
                showHeatmap={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Shots on Target"
                value="8"
                progress={67}
                className="text-center"
              />
              <MetricCard
                title="Key Passes"
                value="12"
                progress={80}
                className="text-center"
              />
              <MetricCard
                title="Successful Dribbles"
                value="15"
                progress={83}
                className="text-center"
              />
              <MetricCard
                title="Attacking Actions"
                value="35"
                progress={78}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Group */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Group Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                activities={physicalActivities.activities}
                distribution={physicalActivities.distribution}
                showHeatmap={true}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Distance Covered"
                value="11.2km"
                progress={85}
                className="text-center"
              />
              <MetricCard
                title="Sprint Distance"
                value="2.8km"
                progress={90}
                className="text-center"
              />
              <MetricCard
                title="High Intensity"
                value="156"
                progress={78}
                className="text-center"
              />
              <MetricCard
                title="Physical Actions"
                value="89"
                progress={82}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerActivityField;
