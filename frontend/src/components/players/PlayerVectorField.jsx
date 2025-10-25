// src/components/players/PlayerVectorField.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FootballPitch from "@/components/common/FootballPitch";
import MetricCard from "@/components/common/MetricCard";
import { Navigation, ArrowUpRight, Target, Zap } from "lucide-react";

const PlayerVectorField = ({ player, metrics }) => {
  if (!player) return null;

  const positionVectors = {
    vectors: [
      {
        startX: 35,
        startY: 40,
        endX: 50,
        endY: 55,
        color: "#3b82f6",
        width: 3,
      },
      {
        startX: 40,
        startY: 45,
        endX: 55,
        endY: 40,
        color: "#3b82f6",
        width: 2,
      },
      {
        startX: 45,
        startY: 50,
        endX: 60,
        endY: 45,
        color: "#3b82f6",
        width: 4,
      },
      {
        startX: 50,
        startY: 35,
        endX: 65,
        endY: 50,
        color: "#3b82f6",
        width: 3,
      },
    ],
  };

  const defenseVectors = {
    vectors: [
      {
        startX: 25,
        startY: 50,
        endX: 35,
        endY: 45,
        color: "#10b981",
        width: 3,
      },
      {
        startX: 30,
        startY: 55,
        endX: 40,
        endY: 50,
        color: "#10b981",
        width: 2,
      },
      {
        startX: 35,
        startY: 48,
        endX: 45,
        endY: 52,
        color: "#10b981",
        width: 4,
      },
    ],
  };

  const attackVectors = {
    vectors: [
      {
        startX: 65,
        startY: 40,
        endX: 75,
        endY: 35,
        color: "#f59e0b",
        width: 4,
      },
      {
        startX: 60,
        startY: 45,
        endX: 70,
        endY: 40,
        color: "#f59e0b",
        width: 3,
      },
      {
        startX: 70,
        startY: 38,
        endX: 80,
        endY: 32,
        color: "#f59e0b",
        width: 5,
      },
    ],
  };

  const physicalVectors = {
    vectors: [
      {
        startX: 45,
        startY: 55,
        endX: 55,
        endY: 45,
        color: "#8b5cf6",
        width: 4,
      },
      {
        startX: 50,
        startY: 50,
        endX: 60,
        endY: 55,
        color: "#8b5cf6",
        width: 3,
      },
      {
        startX: 55,
        startY: 45,
        endX: 65,
        endY: 50,
        color: "#8b5cf6",
        width: 5,
      },
    ],
  };

  const vectorStats = [
    {
      label: "Progressive Vectors",
      value: "24",
      icon: ArrowUpRight,
      progress: 80,
    },
    { label: "Vector Length Avg", value: "18.5m", icon: Navigation },
    { label: "Successful Vectors", value: "32", icon: Target },
    { label: "Special Vectors", value: "8", icon: Zap },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Position Group Vectors */}
      <Card>
        <CardHeader>
          <CardTitle>Position Group Vector Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                vectors={positionVectors.vectors}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {vectorStats.map((stat, index) => (
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

      {/* Defense Group Vectors */}
      <Card>
        <CardHeader>
          <CardTitle>Defense Group Vector Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                vectors={defenseVectors.vectors}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Defensive Vectors"
                value="18"
                progress={75}
                className="text-center"
              />
              <MetricCard
                title="Interception Vectors"
                value="12"
                progress={80}
                className="text-center"
              />
              <MetricCard
                title="Pressure Vectors"
                value="15"
                progress={70}
                className="text-center"
              />
              <MetricCard
                title="Recovery Vectors"
                value="9"
                progress={65}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attack Group Vectors */}
      <Card>
        <CardHeader>
          <CardTitle>Attack Group Vector Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                vectors={attackVectors.vectors}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Attacking Vectors"
                value="22"
                progress={85}
                className="text-center"
              />
              <MetricCard
                title="Assist Vectors"
                value="8"
                progress={90}
                className="text-center"
              />
              <MetricCard
                title="Shot Vectors"
                value="14"
                progress={78}
                className="text-center"
              />
              <MetricCard
                title="Creation Vectors"
                value="16"
                progress={82}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Physical Group Vectors */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Group Vector Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <FootballPitch
                width={500}
                height={350}
                vectors={physicalVectors.vectors}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Movement Vectors"
                value="28"
                progress={88}
                className="text-center"
              />
              <MetricCard
                title="Sprint Vectors"
                value="15"
                progress={92}
                className="text-center"
              />
              <MetricCard
                title="Recovery Vectors"
                value="12"
                progress={75}
                className="text-center"
              />
              <MetricCard
                title="Physical Vectors"
                value="55"
                progress={85}
                className="text-center"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerVectorField;
