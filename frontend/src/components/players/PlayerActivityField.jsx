import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const PlayerActivityField = ({
  eventsData = {},
  category = "Passing",
  className = "",
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Grid configuration
  const GRID_COLS = 10;
  const GRID_ROWS = 8;

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

  // Process activities for grid
  const processActivitiesData = () => {
    if (!pitchDimensions) return { grid: [], totalCount: 0 };

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;

    // Initialize grid
    const grid = Array(GRID_ROWS)
      .fill()
      .map((_, row) =>
        Array(GRID_COLS)
          .fill()
          .map((_, col) => ({
            row,
            col,
            successful: 0,
            unsuccessful: 0,
            total: 0,
            activities: [],
          }))
      );

    let totalCount = 0;

    // Process events
    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (!event.position_x || !event.position_y) return;

          // Convert coordinates to grid cells
          const cellX = Math.floor((event.position_x / 110) * GRID_COLS);
          const cellY = Math.floor((event.position_y / 68) * GRID_ROWS);

          if (
            cellX >= 0 &&
            cellX < GRID_COLS &&
            cellY >= 0 &&
            cellY < GRID_ROWS
          ) {
            const cell = grid[cellY][cellX];
            const isUnsuccessful =
              actionType.includes("Unsuccessful") ||
              actionType.includes("Lost") ||
              actionType.includes("Off Target");

            if (isUnsuccessful) {
              cell.unsuccessful++;
            } else {
              cell.successful++;
            }
            cell.total++;
            cell.activities.push({
              ...event,
              actionType,
              subcategory: subcat,
              successful: !isUnsuccessful,
            });
            totalCount++;
          }
        });
      });
    });

    return { grid: grid.flat(), totalCount };
  };

  const { grid, totalCount } = processActivitiesData();
  const maxCellCount = Math.max(...grid.map((cell) => cell.total), 1);

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  // Handle mouse move for hover effects
  const handleMouseMove = (event, cell) => {
    setHoveredCell(cell);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{category} Activity Field</CardTitle>
        <p className="text-sm text-muted-foreground">
          {GRID_COLS}×{GRID_ROWS} grid showing activity density
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
                    id={`activity-${subcat}`}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                  />
                  <Label htmlFor={`activity-${subcat}`} className="text-sm">
                    {subcat}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {/* Pitch Visualization */}
          <div className="relative">
            <FootballPitch onDimensionsChange={setPitchDimensions}>
              {pitchDimensions && (
                <div
                  className="absolute inset-0 grid pointer-events-auto"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                    padding: "8px 16px",
                  }}
                >
                  {grid.map((cell) => {
                    const cellWidth = pitchDimensions.width / GRID_COLS;
                    const cellHeight = pitchDimensions.height / GRID_ROWS;

                    // Calculate color intensity
                    const intensity = cell.total / maxCellCount;
                    const baseColor =
                      cell.unsuccessful > cell.successful
                        ? "#ef4444"
                        : "#10b981";
                    const backgroundColor = `${baseColor}${Math.floor(
                      30 + intensity * 70
                    )
                      .toString(16)
                      .padStart(2, "0")}`;

                    return (
                      <div
                        key={`${cell.row}-${cell.col}`}
                        className="relative border border-white/30 flex items-center justify-center transition-all duration-200"
                        style={{
                          backgroundColor:
                            cell.total > 0 ? backgroundColor : "transparent",
                          transform:
                            hoveredCell?.row === cell.row &&
                            hoveredCell?.col === cell.col,
                          zIndex:
                            hoveredCell?.row === cell.row &&
                            hoveredCell?.col === cell.col
                              ? 10
                              : 1,
                        }}
                        onMouseMove={(e) => handleMouseMove(e, cell)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Cell count */}
                        {cell.total > 0 && (
                          <div className="text-white text-xs font-bold drop-shadow-lg">
                            {cell.total}
                          </div>
                        )}

                        {/* Hover tooltip */}
                        {hoveredCell?.row === cell.row &&
                          hoveredCell?.col === cell.col && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 text-white text-xs rounded p-2 whitespace-nowrap z-20">
                              <div>
                                Cell ({cell.col}, {cell.row})
                              </div>
                              <div>Total: {cell.total}</div>
                              <div>Successful: {cell.successful}</div>
                              <div>Unsuccessful: {cell.unsuccessful}</div>
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>
              )}
            </FootballPitch>
          </div>
          {/* Statistics */}
          {totalCount > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {totalCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Activities
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {grid.filter((cell) => cell.total > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Cells
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {maxCellCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Max per Cell
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {(
                    (grid.filter((cell) => cell.total > 0).length /
                      (GRID_COLS * GRID_ROWS)) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Coverage</div>
              </div>
            </div>
          )}
          {/* Legend */}
          <div className="flex justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/50 rounded"></div>
              <span>Successful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/50 rounded"></div>
              <span>Unsuccessful</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500/30 rounded border border-white/30"></div>
              <span>No Activity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerActivityField;
