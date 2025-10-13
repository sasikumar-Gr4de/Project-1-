import { PITCH_DIMENSIONS } from "./constants";

// Convert percentage coordinates to pixel coordinates
export const percentageToPixels = (
  xPercent,
  yPercent,
  containerWidth,
  containerHeight
) => {
  const x = (xPercent / 100) * containerWidth;
  const y = (yPercent / 100) * containerHeight;
  return { x, y };
};

// Convert pixel coordinates to percentage coordinates
export const pixelsToPercentage = (x, y, containerWidth, containerHeight) => {
  const xPercent = (x / containerWidth) * 100;
  const yPercent = (y / containerHeight) * 100;
  return { x: xPercent, y: yPercent };
};

// Convert real-world coordinates to percentage coordinates
export const realToPercentage = (xReal, yReal) => {
  const xPercent = (xReal / PITCH_DIMENSIONS.REAL_WIDTH) * 100;
  const yPercent = (yReal / PITCH_DIMENSIONS.REAL_HEIGHT) * 100;
  return { x: xPercent, y: yPercent };
};

// Convert percentage coordinates to real-world coordinates
export const percentageToReal = (xPercent, yPercent) => {
  const xReal = (xPercent / 100) * PITCH_DIMENSIONS.REAL_WIDTH;
  const yReal = (yPercent / 100) * PITCH_DIMENSIONS.REAL_HEIGHT;
  return { x: xReal, y: yReal };
};

// Calculate distance between two points in percentage coordinates
export const calculateDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calculate angle between two points in degrees
export const calculateAngle = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle < 0 ? angle + 360 : angle;
};

// Get zone from coordinates (divides pitch into zones)
export const getZone = (x, y, zonesX = 6, zonesY = 4) => {
  const zoneX = Math.floor((x / 100) * zonesX);
  const zoneY = Math.floor((y / 100) * zonesY);
  return { zoneX, zoneY, zone: `${zoneX}-${zoneY}` };
};

// Check if coordinates are within pitch boundaries
export const isInPitch = (x, y, margin = 0) => {
  return x >= margin && x <= 100 - margin && y >= margin && y <= 100 - margin;
};

// Get position name from coordinates
export const getPositionFromCoordinates = (x, y) => {
  const zones = {
    GK: { x: [0, 10], y: [30, 70] },
    CB: { x: [10, 25], y: [30, 70] },
    LCB: { x: [10, 25], y: [0, 30] },
    RCB: { x: [10, 25], y: [70, 100] },
    LB: { x: [10, 25], y: [0, 15] },
    RB: { x: [10, 25], y: [85, 100] },
    LWB: { x: [20, 35], y: [0, 20] },
    RWB: { x: [20, 35], y: [80, 100] },
    CDM: { x: [25, 40], y: [30, 70] },
    CM: { x: [40, 60], y: [30, 70] },
    LCM: { x: [40, 60], y: [15, 45] },
    RCM: { x: [40, 60], y: [55, 85] },
    CAM: { x: [55, 70], y: [30, 70] },
    LAM: { x: [55, 70], y: [15, 45] },
    RAM: { x: [55, 70], y: [55, 85] },
    LM: { x: [40, 60], y: [0, 20] },
    RM: { x: [40, 60], y: [80, 100] },
    LW: { x: [55, 75], y: [0, 25] },
    RW: { x: [55, 75], y: [75, 100] },
    CF: { x: [70, 90], y: [30, 70] },
    ST: { x: [80, 100], y: [30, 70] },
    LS: { x: [80, 100], y: [15, 45] },
    RS: { x: [80, 100], y: [55, 85] },
  };

  for (const [position, area] of Object.entries(zones)) {
    if (x >= area.x[0] && x <= area.x[1] && y >= area.y[0] && y <= area.y[1]) {
      return position;
    }
  }

  return "Unknown";
};

// Generate heatmap data from events
export const generateHeatmapData = (events, gridSize = 10) => {
  const grid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(0));

  events.forEach((event) => {
    if (event.start_x && event.start_y) {
      const gridX = Math.floor((event.start_x / 100) * gridSize);
      const gridY = Math.floor((event.start_y / 100) * gridSize);

      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        grid[gridY][gridX]++;
      }
    }
  });

  // Normalize to 0-1 range
  const maxValue = Math.max(...grid.flat());
  const normalizedGrid = grid.map((row) =>
    row.map((value) => (maxValue > 0 ? value / maxValue : 0))
  );

  return normalizedGrid;
};

// Calculate player influence map
export const calculateInfluenceMap = (events, playerId, gridSize = 10) => {
  const influence = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(0));

  const playerEvents = events.filter((event) => event.player_id === playerId);

  playerEvents.forEach((event) => {
    if (event.start_x && event.start_y) {
      const gridX = Math.floor((event.start_x / 100) * gridSize);
      const gridY = Math.floor((event.start_y / 100) * gridSize);

      if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
        // Different events have different influence weights
        let weight = 1;
        if (event.event_type === "goal") weight = 5;
        else if (event.event_type === "assist") weight = 3;
        else if (event.event_type === "key_pass") weight = 2;
        else if (event.event_type === "shot") weight = 1.5;

        influence[gridY][gridX] += weight;
      }
    }
  });

  return influence;
};

// Generate pass network data
export const generatePassNetwork = (events, players) => {
  const nodes = players.map((player) => ({
    id: player.id,
    name: player.name,
    position: player.primary_position_id,
    passCount: 0,
    receiveCount: 0,
  }));

  const links = [];
  const passMap = new Map();

  events.forEach((event) => {
    if (event.event_type === "pass" && event.related_event_id) {
      const passerId = event.player_id;
      // In a real implementation, you'd find the receiver from related events
      // This is a simplified version

      if (passerId) {
        // Update passer node
        const passerNode = nodes.find((node) => node.id === passerId);
        if (passerNode) {
          passerNode.passCount++;
        }

        // For now, we'll create a simplified network
        // In practice, you'd need to track pass connections properly
      }
    }
  });

  return { nodes, links };
};

// Calculate player average position
export const calculateAveragePosition = (events, playerId) => {
  const playerEvents = events.filter(
    (event) => event.player_id === playerId && event.start_x && event.start_y
  );

  if (playerEvents.length === 0) {
    return { x: 50, y: 50 }; // Default center position
  }

  const totalX = playerEvents.reduce((sum, event) => sum + event.start_x, 0);
  const totalY = playerEvents.reduce((sum, event) => sum + event.start_y, 0);

  return {
    x: totalX / playerEvents.length,
    y: totalY / playerEvents.length,
  };
};

// Draw pitch markings on canvas
export const drawPitchMarkings = (
  ctx,
  width,
  height,
  color = "#ffffff",
  lineWidth = 2
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;

  // Center circle
  const centerX = width / 2;
  const centerY = height / 2;
  const circleRadius = width * 0.08; // 8% of width

  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();

  // Center spot
  ctx.beginPath();
  ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
  ctx.fill();

  // Center line
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.stroke();

  // Penalty areas
  const penaltyWidth = width * 0.16; // 16% of width
  const penaltyHeight = height * 0.47; // 47% of height
  const penaltyY = (height - penaltyHeight) / 2;

  // Left penalty area
  ctx.strokeRect(0, penaltyY, penaltyWidth, penaltyHeight);

  // Right penalty area
  ctx.strokeRect(width - penaltyWidth, penaltyY, penaltyWidth, penaltyHeight);

  // Goals
  const goalWidth = 2;
  const goalHeight = height * 0.18; // 18% of height
  const goalY = (height - goalHeight) / 2;

  // Left goal
  ctx.strokeRect(0, goalY, goalWidth, goalHeight);

  // Right goal
  ctx.strokeRect(width - goalWidth, goalY, goalWidth, goalHeight);

  // Penalty spots
  const penaltySpotX = width * 0.11; // 11% from left/right

  // Left penalty spot
  ctx.beginPath();
  ctx.arc(penaltySpotX, centerY, 2, 0, 2 * Math.PI);
  ctx.fill();

  // Right penalty spot
  ctx.beginPath();
  ctx.arc(width - penaltySpotX, centerY, 2, 0, 2 * Math.PI);
  ctx.fill();
};

export default {
  percentageToPixels,
  pixelsToPercentage,
  realToPercentage,
  percentageToReal,
  calculateDistance,
  calculateAngle,
  getZone,
  isInPitch,
  getPositionFromCoordinates,
  generateHeatmapData,
  calculateInfluenceMap,
  generatePassNetwork,
  calculateAveragePosition,
  drawPitchMarkings,
};
