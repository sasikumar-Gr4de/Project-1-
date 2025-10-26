import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const PlayerActivityField = ({
  eventsData = {},
  category = "Passing",
  className = "",
  compactMode = false, // New prop for compact mode
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(true);
  const containerRef = useRef(null);

  const GRID_COLS = 10;
  const GRID_ROWS = 8;

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

  const processActivitiesData = () => {
    if (!pitchDimensions) return { grid: [], totalCount: 0 };

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;

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

    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (!event.position_x || !event.position_y) return;

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

  const handleCellHover = (event, cell) => {
    if (!pitchDimensions || !containerRef.current || compactMode) return;

    setHoveredCell(cell);

    const containerRect = containerRef.current.getBoundingClientRect();
    const cellWidth = pitchDimensions.width / GRID_COLS;
    const cellHeight = pitchDimensions.height / GRID_ROWS;
    const cellCenterX =
      containerRect.left + (cell.col * cellWidth + cellWidth / 2);
    const cellCenterY =
      containerRect.top + (cell.row * cellHeight + cellHeight / 2);

    setTooltipPosition({ x: cellCenterX, y: cellCenterY });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  // If in compact mode, render only the pitch visualization
  if (compactMode) {
    return (
      <div className={`h-full w-full ${className}`}>
        <FootballPitch onDimensionsChange={setPitchDimensions} compact={true}>
          {pitchDimensions && (
            <svg
              className="absolute inset-0 pointer-events-auto"
              width={pitchDimensions.width}
              height={pitchDimensions.height}
              style={{ padding: "0", margin: "0" }}
            >
              {grid.map((cell) => {
                const cellWidth = pitchDimensions.width / GRID_COLS;
                const cellHeight = pitchDimensions.height / GRID_ROWS;
                const cellX = cell.col * cellWidth;
                const cellY = cell.row * cellHeight;

                const intensity = cell.total / maxCellCount;
                const baseColor =
                  cell.unsuccessful > cell.successful ? "#ef4444" : "#10b981";
                const opacity = cell.total > 0 ? 0.3 + intensity * 0.7 : 0;

                return (
                  <g key={`${cell.row}-${cell.col}`}>
                    <rect
                      x={cellX}
                      y={cellY}
                      width={cellWidth}
                      height={cellHeight}
                      fill={cell.total > 0 ? baseColor : "transparent"}
                      fillOpacity={opacity}
                      stroke="rgba(255, 255, 255, 0.3)"
                      strokeWidth="1"
                      className="transition-all duration-200"
                    />

                    {/* Show count only if there's enough space */}
                    {cell.total > 0 && cellWidth > 20 && (
                      <text
                        x={cellX + cellWidth / 2}
                        y={cellY + cellHeight / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-white font-bold pointer-events-none"
                        fill="white"
                        style={{
                          fontSize: Math.max(6, Math.min(10, cellWidth * 0.1)),
                          filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))",
                        }}
                      >
                        {cell.total}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </FootballPitch>
      </div>
    );
  }

  // Full mode rendering
  return (
    <Card className={className + "border-0"}>
      <CardHeader className="pb-1">
        <CardTitle className="text-lg sm:text-xl">
          {category} Activity
        </CardTitle>
        {/* <p className="text-xs sm:text-sm text-muted-foreground">
          {GRID_COLS}×{GRID_ROWS} grid • {totalCount} activities
        </p> */}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Subcategory Selection - Only on larger screens */}
        {showDetails && subcategories.length > 0 && (
          <div className="bg-muted p-3 rounded-lg">
            {/* <Label className="text-xs sm:text-sm font-medium mb-2 block">
              Subcategories:
            </Label> */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {subcategories.map((subcat) => (
                <div
                  key={subcat}
                  className="flex items-center space-x-1 sm:space-x-2"
                >
                  <Checkbox
                    id={`activity-${subcat}`}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor={`activity-${subcat}`}
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
        <div
          className="relative min-h-[200px] sm:min-h-[250px]"
          ref={containerRef}
        >
          <FootballPitch onDimensionsChange={setPitchDimensions}>
            {pitchDimensions && (
              <svg
                className="absolute inset-0 pointer-events-auto"
                width={pitchDimensions.width}
                height={pitchDimensions.height}
                style={{ padding: "0", margin: "0" }}
              >
                {grid.map((cell) => {
                  const cellWidth = pitchDimensions.width / GRID_COLS;
                  const cellHeight = pitchDimensions.height / GRID_ROWS;
                  const cellX = cell.col * cellWidth;
                  const cellY = cell.row * cellHeight;

                  const intensity = cell.total / maxCellCount;
                  const baseColor =
                    cell.unsuccessful > cell.successful ? "#ef4444" : "#10b981";
                  const opacity = cell.total > 0 ? 0.3 + intensity * 0.7 : 0;

                  return (
                    <g key={`${cell.row}-${cell.col}`}>
                      <rect
                        x={cellX}
                        y={cellY}
                        width={cellWidth}
                        height={cellHeight}
                        fill={cell.total > 0 ? baseColor : "transparent"}
                        fillOpacity={opacity}
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1"
                        className="transition-all duration-200 cursor-pointer hover:fill-opacity-80"
                        onMouseEnter={(e) => handleCellHover(e, cell)}
                        onMouseLeave={handleCellLeave}
                      />

                      {cell.total > 0 && (
                        <text
                          x={cellX + cellWidth / 2}
                          y={cellY + cellHeight / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-white font-bold pointer-events-none"
                          fill="white"
                          style={{
                            fontSize: Math.max(
                              8,
                              Math.min(12, cellWidth * 0.12)
                            ),
                            filter:
                              "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.8))",
                          }}
                        >
                          {cell.total}
                        </text>
                      )}

                      {hoveredCell?.row === cell.row &&
                        hoveredCell?.col === cell.col && (
                          <rect
                            x={cellX}
                            y={cellY}
                            width={cellWidth}
                            height={cellHeight}
                            fill="rgba(255, 255, 255, 0.2)"
                            stroke="rgba(255, 255, 255, 0.8)"
                            strokeWidth="2"
                            className="pointer-events-none"
                          />
                        )}
                    </g>
                  );
                })}
              </svg>
            )}
          </FootballPitch>

          {/* Tooltip */}
          {hoveredCell && (
            <div
              className="fixed bg-black/95 text-white text-xs rounded-lg p-2 z-50 pointer-events-none border border-white/20 shadow-lg"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y - 60}px`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-semibold border-b border-white/20 pb-1 mb-1">
                Cell ({hoveredCell.col}, {hoveredCell.row})
              </div>
              <div className="space-y-1">
                <div className="flex justify-between gap-3">
                  <span>Total:</span>
                  <span className="font-medium">{hoveredCell.total}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-green-300">Success:</span>
                  <span className="font-medium text-green-300">
                    {hoveredCell.successful}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-red-300">Fail:</span>
                  <span className="font-medium text-red-300">
                    {hoveredCell.unsuccessful}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        {totalCount > 0 && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {totalCount}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-green-600">
                {grid.filter((cell) => cell.total > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-yellow-600">
                {maxCellCount}
              </div>
              <div className="text-xs text-muted-foreground">Max</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg sm:text-xl font-bold text-purple-600">
                {(
                  (grid.filter((cell) => cell.total > 0).length /
                    (GRID_COLS * GRID_ROWS)) *
                  100
                ).toFixed(0)}
                %
              </div>
              <div className="text-xs text-muted-foreground">Coverage</div>
            </div>
          </div>
        )}

        {/* Legend */}
        {showDetails && (
          <div className="flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-green-500/50 rounded border border-white/30"></div>
              <span>Success</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 bg-red-500/50 rounded border border-white/30"></div>
              <span>Fail</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerActivityField;
