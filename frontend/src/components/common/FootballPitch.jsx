import { useRef, useEffect } from "react";

const FootballPitch = ({
  width = 800,
  height = 600,
  vectors = [],
  activities = [],
  distribution = [],
  showGrid = true,
  showHeatmap = false,
  className = "",
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw pitch background
    ctx.fillStyle = "#0a7c42";
    ctx.fillRect(0, 0, width, height);

    // Draw pitch markings
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    // Outer border
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // Center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 70, 0, 2 * Math.PI);
    ctx.stroke();

    // Penalty areas
    ctx.strokeRect(0, height / 2 - 110, 132, 220); // Left
    ctx.strokeRect(width - 132, height / 2 - 110, 132, 220); // Right

    // Goals
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, height / 2 - 36, 8, 72); // Left goal
    ctx.fillRect(width - 8, height / 2 - 36, 8, 72); // Right goal

    // Draw distribution map (heatmap)
    if (showHeatmap && distribution.length > 0) {
      distribution.forEach((point) => {
        const x = (point.x / 100) * width;
        const y = (point.y / 100) * height;
        const radius = point.intensity * 20;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${point.intensity * 0.6})`);
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      });
    }

    // Draw activities
    activities.forEach((activity) => {
      const x = (activity.x / 100) * width;
      const y = (activity.y / 100) * height;
      const size = activity.size || 6;

      ctx.fillStyle = activity.color || "#ef4444";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Add glow effect for successful attempts
      if (activity.successful) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw vectors
    vectors.forEach((vector) => {
      const startX = (vector.startX / 100) * width;
      const startY = (vector.startY / 100) * height;
      const endX = (vector.endX / 100) * width;
      const endY = (vector.endY / 100) * height;

      ctx.strokeStyle = vector.color || "#3b82f6";
      ctx.lineWidth = vector.width || 2;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(endY - startY, endX - startX);
      const arrowSize = 8;

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle - Math.PI / 6),
        endY - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(angle + Math.PI / 6),
        endY - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = vector.color || "#3b82f6";
      ctx.fill();
    });
  }, [width, height, vectors, activities, distribution, showHeatmap]);

  return (
    <div className={`bg-green-800 p-4 rounded-lg inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-2 border-white rounded"
      />
    </div>
  );
};

export default FootballPitch;
