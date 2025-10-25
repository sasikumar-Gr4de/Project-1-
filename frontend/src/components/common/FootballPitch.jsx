import { useRef, useEffect, useState } from "react";

const FootballPitch = ({
  width = "100%",
  height = 400,
  className = "",
  pitchColor = "#0a7c42",
  lineColor = "#ffffff",
  children,
  onDimensionsChange,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 467, height: 290 });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const aspectRatio = 467 / 290;
        const calculatedHeight = containerWidth / aspectRatio;
        const newDimensions = {
          width: containerWidth,
          height: calculatedHeight,
        };
        setDimensions(newDimensions);
        onDimensionsChange?.(newDimensions);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, [onDimensionsChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { width: pitchWidth, height: pitchHeight } = dimensions;

    canvas.width = pitchWidth;
    canvas.height = pitchHeight;

    // Clear canvas
    ctx.clearRect(0, 0, pitchWidth, pitchHeight);

    // Draw pitch background
    ctx.fillStyle = pitchColor;
    ctx.fillRect(0, 0, pitchWidth, pitchHeight);

    // Draw pitch markings
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
    ctx.arc(pitchWidth / 2, pitchHeight / 2, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Penalty areas
    const penaltyWidth = pitchWidth * 0.2;
    const penaltyHeight = pitchHeight * 0.507;
    const penaltyY = (pitchHeight - penaltyHeight) / 2;

    ctx.strokeRect(0, penaltyY, penaltyWidth, penaltyHeight);
    ctx.strokeRect(
      pitchWidth - penaltyWidth,
      penaltyY,
      penaltyWidth,
      penaltyHeight
    );

    // Goal areas
    const goalAreaWidth = pitchWidth * 0.05;
    const goalAreaHeight = pitchHeight * 0.264;
    const goalAreaY = (pitchHeight - goalAreaHeight) / 2;

    ctx.strokeRect(0, goalAreaY, goalAreaWidth, goalAreaHeight);
    ctx.strokeRect(
      pitchWidth - goalAreaWidth,
      goalAreaY,
      goalAreaWidth,
      goalAreaHeight
    );

    // Penalty spots
    ctx.beginPath();
    ctx.arc(penaltyWidth * 0.6, pitchHeight / 2, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      pitchWidth - penaltyWidth * 0.6,
      pitchHeight / 2,
      2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Penalty arcs
    const penaltyArcRadius = pitchHeight * 0.182;
    ctx.beginPath();
    ctx.arc(
      penaltyWidth,
      pitchHeight / 2,
      penaltyArcRadius,
      -Math.PI * 0.5,
      Math.PI * 0.5,
      false
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      pitchWidth - penaltyWidth,
      pitchHeight / 2,
      penaltyArcRadius,
      Math.PI * 0.5,
      Math.PI * 1.5,
      false
    );
    ctx.stroke();

    // Corner arcs
    const cornerRadius = 5;
    ctx.beginPath();
    ctx.arc(0, 0, cornerRadius, 0, Math.PI * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, pitchHeight, cornerRadius, -Math.PI * 0.5, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pitchWidth, 0, cornerRadius, Math.PI * 0.5, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pitchWidth, pitchHeight, cornerRadius, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    // Goals
    const goalHeight = pitchHeight * 0.248;
    const goalY = (pitchHeight - goalHeight) / 2;
    ctx.fillRect(0, goalY, 4, goalHeight);
    ctx.fillRect(pitchWidth - 4, goalY, 4, goalHeight);
  }, [dimensions, pitchColor, lineColor]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-green-800 p-2 sm:p-4 rounded-lg w-full ${className}`}
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
      {/* Overlay container for child components */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          padding: "calc(0.5rem + 2px) calc(1rem + 2px)",
          margin: "-2px",
        }}
      >
        {children &&
          React.Children.map(children, (child) =>
            React.cloneElement(child, { dimensions })
          )}
      </div>
    </div>
  );
};

export default FootballPitch;
