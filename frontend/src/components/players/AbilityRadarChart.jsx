import React from "react";

const AbilityRadarChart = ({ abilities }) => {
  const categories = [
    { key: "technical", label: "Technical", color: "#3b82f6" },
    { key: "tactical", label: "Tactical", color: "#10b981" },
    { key: "physical", label: "Physical", color: "#ef4444" },
    { key: "mental", label: "Mental", color: "#f59e0b" },
    { key: "creativity", label: "Creativity", color: "#8b5cf6" },
  ];

  const maxValue = 100;
  const numberOfCircles = 4;
  const radius = 80;
  const center = 100;

  const getCoordinate = (angle, value) => {
    const radians = (angle * Math.PI) / 180;
    const distance = (value / maxValue) * radius;
    return {
      x: center + distance * Math.cos(radians),
      y: center + distance * Math.sin(radians),
    };
  };

  const points = categories.map((category, index) => {
    const angle = (index * 360) / categories.length - 90;
    return getCoordinate(angle, abilities[category.key] || 0);
  });

  const polygonPoints = points
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  return (
    <div className="w-full h-full flex flex-col items-center">
      <svg width="300" height="300" viewBox="0 0 200 200" className="mb-4">
        {/* Background circles */}
        {Array.from({ length: numberOfCircles }).map((_, index) => (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={(radius * (index + 1)) / numberOfCircles}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
          />
        ))}

        {/* Category lines */}
        {categories.map((category, index) => {
          const angle = (index * 360) / categories.length - 90;
          const endPoint = getCoordinate(angle, maxValue);
          return (
            <line
              key={category.key}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="#374151"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={categories[0].color}
          fillOpacity="0.2"
          stroke={categories[0].color}
          strokeWidth="2"
        />

        {/* Data points and labels */}
        {categories.map((category, index) => {
          const angle = (index * 360) / categories.length - 90;
          const point = points[index];
          const labelPoint = getCoordinate(angle, maxValue + 15);

          return (
            <g key={category.key}>
              <circle cx={point.x} cy={point.y} r="4" fill={category.color} />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="10"
                fontWeight="500"
              >
                {category.label}
              </text>
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="10"
                fontWeight="bold"
              >
                {abilities[category.key] || 0}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm text-gray-400">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbilityRadarChart;
