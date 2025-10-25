// src/components/common/FootballPitch.jsx
import { useRef, useEffect, useState } from "react";

const FootballPitch = ({
  width = "100%",
  height = 400,
  vectors = [],
  activities = [],
  distribution = [],
  showGrid = true,
  showHeatmap = false,
  showArrows = true,
  className = "",
  pitchColor = "#0a7c42",
  lineColor = "#ffffff",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 467, height: 290 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = 467 / 290; // Original aspect ratio from sample
        const calculatedHeight = containerWidth / aspectRatio;
        setDimensions({
          width: containerWidth,
          height: calculatedHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width: pitchWidth, height: pitchHeight } = dimensions;

    // Set canvas dimensions
    canvas.width = pitchWidth;
    canvas.height = pitchHeight;

    // Clear canvas
    ctx.clearRect(0, 0, pitchWidth, pitchHeight);

    // Draw pitch background
    ctx.fillStyle = pitchColor;
    ctx.fillRect(0, 0, pitchWidth, pitchHeight);

    // Draw pitch markings (based on sample SVG)
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.fillStyle = lineColor;

    // Outer border
    ctx.strokeRect(2, 2, pitchWidth - 4, pitchHeight - 4);

    // Center line
    ctx.beginPath();
    ctx.moveTo(pitchWidth / 2, 0);
    ctx.lineTo(pitchWidth / 2, pitchHeight);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(
      pitchWidth / 2,
      pitchHeight / 2,
      pitchHeight * 0.048,
      0,
      2 * Math.PI
    );
    ctx.stroke();

    // Center spot
    ctx.beginPath();
    ctx.arc(pitchWidth / 2, pitchHeight / 2, 3, 0, 2 * Math.PI);
    ctx.fill();

    // Penalty areas - Left
    const penaltyWidth = pitchWidth * 0.2; // 20% of pitch width
    const penaltyHeight = pitchHeight * 0.507; // 50.7% of pitch height
    const penaltyY = (pitchHeight - penaltyHeight) / 2;

    ctx.strokeRect(0, penaltyY, penaltyWidth, penaltyHeight);

    // Goal area - Left
    const goalAreaWidth = pitchWidth * 0.05; // 5% of pitch width
    const goalAreaHeight = pitchHeight * 0.264; // 26.4% of pitch height
    const goalAreaY = (pitchHeight - goalAreaHeight) / 2;

    ctx.strokeRect(0, goalAreaY, goalAreaWidth, goalAreaHeight);

    // Penalty spot - Left
    ctx.beginPath();
    ctx.arc(penaltyWidth * 0.6, pitchHeight / 2, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Penalty arc - Left
    ctx.beginPath();
    ctx.arc(
      penaltyWidth,
      pitchHeight / 2,
      pitchHeight * 0.182,
      -Math.PI * 0.5,
      Math.PI * 0.5,
      false
    );
    ctx.stroke();

    // Corner arc - Top Left
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 0.5);
    ctx.stroke();

    // Corner arc - Bottom Left
    ctx.beginPath();
    ctx.arc(0, pitchHeight, 5, -Math.PI * 0.5, 0);
    ctx.stroke();

    // Right side markings (mirrored)
    ctx.strokeRect(
      pitchWidth - penaltyWidth,
      penaltyY,
      penaltyWidth,
      penaltyHeight
    );
    ctx.strokeRect(
      pitchWidth - goalAreaWidth,
      goalAreaY,
      goalAreaWidth,
      goalAreaHeight
    );

    // Penalty spot - Right
    ctx.beginPath();
    ctx.arc(
      pitchWidth - penaltyWidth * 0.6,
      pitchHeight / 2,
      2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Penalty arc - Right
    ctx.beginPath();
    ctx.arc(
      pitchWidth - penaltyWidth,
      pitchHeight / 2,
      pitchHeight * 0.182,
      Math.PI * 0.5,
      Math.PI * 1.5,
      false
    );
    ctx.stroke();

    // Corner arc - Top Right
    ctx.beginPath();
    ctx.arc(pitchWidth, 0, 5, Math.PI * 0.5, Math.PI);
    ctx.stroke();

    // Corner arc - Bottom Right
    ctx.beginPath();
    ctx.arc(pitchWidth, pitchHeight, 5, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    // Goals
    ctx.fillStyle = lineColor;
    ctx.fillRect(
      0,
      pitchHeight / 2 - pitchHeight * 0.124,
      4,
      pitchHeight * 0.248
    );
    ctx.fillRect(
      pitchWidth - 4,
      pitchHeight / 2 - pitchHeight * 0.124,
      4,
      pitchHeight * 0.248
    );

    // Draw distribution map (heatmap)
    if (showHeatmap && distribution.length > 0) {
      distribution.forEach((point) => {
        const x = (point.x / 100) * pitchWidth;
        const y = (point.y / 100) * pitchHeight;
        const radius = point.intensity * 30;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 0, 0, ${point.intensity * 0.8})`);
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      });
    }

    // Draw activities
    activities.forEach((activity) => {
      const x = (activity.x / 100) * pitchWidth;
      const y = (activity.y / 100) * pitchHeight;
      const size = activity.size || 6;

      ctx.fillStyle = activity.color || "#ef4444";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();

      // Add border for successful attempts
      if (activity.successful) {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw vectors with arrows
    vectors.forEach((vector) => {
      const startX = (vector.startX / 100) * pitchWidth;
      const startY = (vector.startY / 100) * pitchHeight;
      const endX = (vector.endX / 100) * pitchWidth;
      const endY = (vector.endY / 100) * pitchHeight;

      ctx.strokeStyle = vector.color || "#3b82f6";
      ctx.lineWidth = vector.width || 2;
      ctx.lineCap = "round";

      // Draw line
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Draw arrowhead if enabled
      if (showArrows) {
        const angle = Math.atan2(endY - startY, endX - startX);
        const arrowSize = 8;

        ctx.fillStyle = vector.color || "#3b82f6";
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
        ctx.fill();
      }
    });
  }, [
    dimensions,
    vectors,
    activities,
    distribution,
    showHeatmap,
    showArrows,
    pitchColor,
    lineColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`bg-green-800 p-2 sm:p-4 rounded-lg inline-block w-full ${className}`}
      style={{ maxWidth: "100%" }}
    >
      <canvas
        ref={canvasRef}
        className="border-2 border-white rounded w-full"
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
        }}
      />
    </div>
  );
};

export default FootballPitch;
