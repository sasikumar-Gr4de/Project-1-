import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const PlayerVectorField = ({
  eventsData = {},
  category = "Passing",
  className = "",
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);

  // Color mapping for third-level categories
  const ACTION_COLORS = {
    Unsuccessful: "#ef4444", // Red
    "Simple Pass": "#3b82f6", // Blue
    "Key Pass": "#f59e0b", // Orange
    Assist: "#10b981", // Green
    Successful: "#10b981", // Green
    Crucial: "#8b5cf6", // Purple
    "Off Target": "#ef4444", // Red
    "Simple Shot": "#3b82f6", // Blue
    "Brilliant Shot": "#f59e0b", // Orange
    "Hit Goal Post": "#8b5cf6", // Purple
    "Duel Lost": "#ef4444", // Red
    "Duel Won": "#10b981", // Green
    "Ball Carry Short": "#3b82f6", // Blue
    "Ball Carry Medium": "#f59e0b", // Orange
    "Ball Carry Long": "#ef4444", // Red
  };

  const categoryData = eventsData[category] || {};
  const subcategories = Object.keys(categoryData);

  // Initialize all subcategories as selected
  useEffect(() => {
    const initialSelection = {};
    subcategories.forEach((subcat) => {
      initialSelection[subcat] = true;
    });
    setSelectedSubcategories(initialSelection);
  }, [category]);

  // Process vectors data
  const processVectorsData = () => {
    if (!pitchDimensions) return [];

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;
    const vectors = [];

    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (
            !event.position_x ||
            !event.position_y ||
            !event.position_x_end ||
            !event.position_y_end
          )
            return;

          // Convert coordinates to pitch pixels (attack direction: left to right)
          const startX = (event.position_x / 110) * pitchWidth;
          const startY = (event.position_y / 68) * pitchHeight;
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
          });
        });
      });
    });

    return vectors;
  };

  const vectors = processVectorsData();

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  // Get unique action types for legend
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{category} Vector Field</CardTitle>
        <p className="text-sm text-muted-foreground">
          Vector visualization of player actions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Subcategory Selection */}
          <div className="bg-muted p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Show Subcategories:
            </Label>
            <div className="flex flex-wrap gap-4">
              {subcategories.map((subcat) => (
                <div key={subcat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`vector-${subcat}`}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                  />
                  <Label htmlFor={`vector-${subcat}`} className="text-sm">
                    {subcat}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pitch Visualization */}
          <div className="relative">
            <FootballPitch onDimensionsChange={setPitchDimensions}>
              {pitchDimensions && vectors.length > 0 && (
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width={pitchDimensions.width}
                  height={pitchDimensions.height}
                  style={{ padding: "8px 16px" }}
                >
                  {vectors.map((vector, index) => (
                    <g key={index}>
                      {/* Vector line */}
                      <line
                        x1={vector.startX}
                        y1={vector.startY}
                        x2={vector.endX}
                        y2={vector.endY}
                        stroke={vector.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Arrowhead */}
                      <defs>
                        <marker
                          id={`arrow-${index}`}
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L0,6 L9,3 z" fill={vector.color} />
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
                </svg>
              )}
            </FootballPitch>
          </div>

          {/* Statistics */}
          {vectors.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Total Vectors:</span>
                <span className="text-lg font-bold">{vectors.length}</span>
              </div>

              {/* Vector count by subcategory */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                {subcategories
                  .filter((subcat) => selectedSubcategories[subcat])
                  .map((subcat) => {
                    const count = vectors.filter(
                      (v) => v.subcategory === subcat
                    ).length;
                    return count > 0 ? (
                      <div key={subcat} className="text-center">
                        <div className="text-sm text-muted-foreground">
                          {subcat}
                        </div>
                        <div className="text-lg font-bold">{count}</div>
                      </div>
                    ) : null;
                  })}
              </div>
            </div>
          )}

          {/* Legend */}
          {uniqueActionTypes.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-sm font-medium mb-3 block">
                Action Type Legend:
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {uniqueActionTypes.map((actionType) => (
                  <div key={actionType} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: ACTION_COLORS[actionType] || "#6b7280",
                      }}
                    />
                    <span className="text-sm">{actionType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerVectorField;
