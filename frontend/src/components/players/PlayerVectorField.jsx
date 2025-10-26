import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const PlayerVectorField = ({
  eventsData = {},
  category = "Passing",
  className = "",
  compactMode = false, // New prop for compact mode
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  const ACTION_COLORS = {
    Unsuccessful: "#ef4444",
    "Simple Pass": "#3b82f6",
    "Key Pass": "#f59e0b",
    Assist: "#10b981",
    Successful: "#10b981",
    Crucial: "#8b5cf6",
    "Off Target": "#ef4444",
    "Simple Shot": "#3b82f6",
    "Brilliant Shot": "#f59e0b",
    "Hit Goal Post": "#8b5cf6",
    "Duel Lost": "#ef4444",
    "Duel Won": "#10b981",
    "Ball Carry Short": "#3b82f6",
    "Ball Carry Medium": "#f59e0b",
    "Ball Carry Long": "#ef4444",
  };

  const categoryData = eventsData[category] || {};
  const subcategories = Object.keys(categoryData);

  // Responsive details
  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      // In compact mode, never show details
      setShowDetails(!compactMode && width >= 768);
    };

    checkResponsive();
    window.addEventListener("resize", checkResponsive);
    return () => window.removeEventListener("resize", checkResponsive);
  }, [compactMode]);

  useEffect(() => {
    const initialSelection = {};
    subcategories.forEach((subcat) => {
      initialSelection[subcat] = true;
    });
    setSelectedSubcategories(initialSelection);
  }, [category]);

  const processVectorsData = () => {
    if (!pitchDimensions) return { vectors: [], points: [] };

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;
    const vectors = [];
    const points = [];

    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (!event.position_x || !event.position_y) return;

          const startX = (event.position_x / 110) * pitchWidth;
          const startY = (event.position_y / 68) * pitchHeight;

          const hasEndPosition = event.position_x_end && event.position_y_end;
          const isSamePosition =
            hasEndPosition &&
            event.position_x === event.position_x_end &&
            event.position_y === event.position_y_end;

          if (hasEndPosition && !isSamePosition) {
            const endX = (event.position_x_end / 110) * pitchWidth;
            const endY = (event.position_y_end / 68) * pitchHeight;

            vectors.push({
              startX,
              startY,
              endX,
              endY,
              color: ACTION_COLORS[actionType] || "#6b7280",
              actionType,
              subcategory: subcat,
              type: "vector",
            });
          } else {
            points.push({
              x: startX,
              y: startY,
              color: ACTION_COLORS[actionType] || "#6b7280",
              actionType,
              subcategory: subcat,
              type: "point",
            });
          }
        });
      });
    });

    return { vectors, points };
  };

  const { vectors, points } = processVectorsData();

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  const getUniqueActionTypes = () => {
    const actionTypes = new Set();
    Object.values(categoryData).forEach((subcatData) => {
      Object.keys(subcatData).forEach((actionType) => {
        actionTypes.add(actionType);
      });
    });
    return Array.from(actionTypes);
  };

  const uniqueActionTypes = getUniqueActionTypes();

  // If in compact mode, render only the pitch visualization
  if (compactMode) {
    return (
      <div className={`h-full w-full ${className}`}>
        <FootballPitch onDimensionsChange={setPitchDimensions} compact={true}>
          {pitchDimensions && (vectors.length > 0 || points.length > 0) && (
            <svg
              className="absolute inset-0 pointer-events-none"
              width={pitchDimensions.width}
              height={pitchDimensions.height}
              style={{ padding: "0" }}
            >
              {/* Render vectors with simplified arrows for compact mode */}
              {vectors.map((vector, index) => (
                <g key={`vector-${index}`}>
                  <line
                    x1={vector.startX}
                    y1={vector.startY}
                    x2={vector.endX}
                    y2={vector.endY}
                    stroke={vector.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Simplified arrowhead for compact mode */}
                  <defs>
                    <marker
                      id={`arrow-compact-${index}`}
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L5,3 z" fill={vector.color} />
                    </marker>
                  </defs>
                  <line
                    x1={vector.startX}
                    y1={vector.startY}
                    x2={vector.endX}
                    y2={vector.endY}
                    stroke={vector.color}
                    strokeWidth="1.5"
                    markerEnd={`url(#arrow-compact-${index})`}
                  />
                </g>
              ))}

              {/* Render points */}
              {points.map((point, index) => (
                <circle
                  key={`point-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill={point.color}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
              ))}
            </svg>
          )}
        </FootballPitch>
      </div>
    );
  }

  // Full mode rendering
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">{category} Vectors</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {vectors.length} vectors • {points.length} points
        </p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Subcategory Selection - Only on larger screens */}
        {showDetails && subcategories.length > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <Label className="text-xs sm:text-sm font-medium mb-2 block">
              Subcategories:
            </Label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {subcategories.map((subcat) => (
                <div
                  key={subcat}
                  className="flex items-center space-x-1 sm:space-x-2"
                >
                  <Checkbox
                    id={`vector-${subcat}`}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor={`vector-${subcat}`}
                    className="text-xs sm:text-sm"
                  >
                    {subcat}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pitch Visualization */}
        <div className="relative min-h-[200px] sm:min-h-[250px]">
          <FootballPitch onDimensionsChange={setPitchDimensions}>
            {pitchDimensions && (vectors.length > 0 || points.length > 0) && (
              <svg
                className="absolute inset-0 pointer-events-none"
                width={pitchDimensions.width}
                height={pitchDimensions.height}
                style={{ padding: "0" }}
              >
                {/* Render vectors */}
                {vectors.map((vector, index) => (
                  <g key={`vector-${index}`}>
                    <line
                      x1={vector.startX}
                      y1={vector.startY}
                      x2={vector.endX}
                      y2={vector.endY}
                      stroke={vector.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <marker
                        id={`arrow-${index}`}
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <path d="M0,0 L0,6 L7,3 z" fill={vector.color} />
                      </marker>
                    </defs>
                    <line
                      x1={vector.startX}
                      y1={vector.startY}
                      x2={vector.endX}
                      y2={vector.endY}
                      stroke={vector.color}
                      strokeWidth="2"
                      markerEnd={`url(#arrow-${index})`}
                    />
                  </g>
                ))}

                {/* Render points */}
                {points.map((point, index) => (
                  <circle
                    key={`point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill={point.color}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            )}
          </FootballPitch>
        </div>

        {/* Statistics */}
        {(vectors.length > 0 || points.length > 0) && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {vectors.length}
              </div>
              <div className="text-xs text-muted-foreground">Vectors</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {points.length}
              </div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {vectors.length + points.length}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-orange-600">
                {uniqueActionTypes.length}
              </div>
              <div className="text-xs text-muted-foreground">Actions</div>
            </div>
          </div>
        )}

        {/* Legend */}
        {showDetails && uniqueActionTypes.length > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            <Label className="text-xs sm:text-sm font-medium mb-2 block">
              Action Types:
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {uniqueActionTypes.map((actionType) => (
                <div
                  key={actionType}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor: ACTION_COLORS[actionType] || "#6b7280",
                    }}
                  />
                  <span className="text-xs sm:text-sm truncate">
                    {actionType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerVectorField;
