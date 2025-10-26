import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const DistributionMap = ({
  eventsData = {},
  category = "Passing",
  sections = 3,
  className = "",
  compactMode = false, // New prop for compact mode
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);
  const [showDetails, setShowDetails] = useState(true);

  const categoryData = eventsData[category] || {};
  const subcategories = Object.keys(categoryData);

  // Responsive details based on container width and compact mode
  useEffect(() => {
    const checkResponsive = () => {
      const width = window.innerWidth;
      // In compact mode, never show details. Otherwise, show on md screens and above
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

  const processDistributionData = () => {
    if (!pitchDimensions) return { sections: [], totalCount: 0 };

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;

    const sectionBoundaries =
      sections === 3
        ? [
            { name: "Opponent Box", minX: 0, maxX: pitchWidth * 0.2 },
            { name: "Middle", minX: pitchWidth * 0.2, maxX: pitchWidth * 0.8 },
            { name: "Self Box", minX: pitchWidth * 0.8, maxX: pitchWidth },
          ]
        : [
            { name: "Opponent Half", minX: 0, maxX: pitchWidth * 0.5 },
            { name: "Self Half", minX: pitchWidth * 0.5, maxX: pitchWidth },
          ];

    const sectionData = sectionBoundaries.map((section) => ({
      ...section,
      counts: {},
      total: 0,
    }));

    let totalEvents = 0;

    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (!event.position_x || !event.position_y) return;

          const pixelX = (event.position_x / 110) * pitchWidth;
          const pixelY = (event.position_y / 68) * pitchHeight;

          const sectionIndex = sectionBoundaries.findIndex(
            (section) => pixelX >= section.minX && pixelX < section.maxX
          );

          if (sectionIndex !== -1) {
            const section = sectionData[sectionIndex];
            section.counts[actionType] = (section.counts[actionType] || 0) + 1;
            section.total++;
            totalEvents++;
          }
        });
      });
    });

    return { sections: sectionData, totalCount: totalEvents };
  };

  const { sections: sectionData, totalCount } = processDistributionData();

  const getSectionGradient = (section, maxDensity) => {
    const density = section.total / maxDensity;
    const opacity = Math.min(0.6, density * 0.8);

    if (section.name.includes("Opponent")) {
      return `rgba(239, 68, 68, ${opacity})`;
    } else if (section.name.includes("Self")) {
      return `rgba(34, 197, 94, ${opacity})`;
    } else {
      return `rgba(59, 130, 246, ${opacity})`;
    }
  };

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  const maxSectionTotal = Math.max(...sectionData.map((s) => s.total), 1);

  // Calculate responsive font size based on pitch dimensions
  const getNumberSize = (pitchWidth) => {
    if (!pitchWidth) return "text-lg";

    if (pitchWidth < 200) return "text-xs";
    if (pitchWidth < 300) return "text-sm";
    if (pitchWidth < 400) return "text-base";
    if (pitchWidth < 500) return "text-lg";
    if (pitchWidth < 600) return "text-xl";
    return "text-2xl";
  };

  // If in compact mode, render only the pitch visualization
  if (compactMode) {
    return (
      <div className={`h-full w-full ${className}`}>
        <FootballPitch onDimensionsChange={setPitchDimensions} compact={true}>
          {pitchDimensions && (
            <div className="absolute inset-0 pointer-events-auto">
              {sectionData.map((section, index) => (
                <div
                  key={section.name}
                  className="absolute top-0 bottom-0 flex items-center justify-center"
                  style={{
                    left: `${(section.minX / pitchDimensions.width) * 100}%`,
                    width: `${
                      ((section.maxX - section.minX) / pitchDimensions.width) *
                      100
                    }%`,
                    backgroundColor: getSectionGradient(
                      section,
                      maxSectionTotal
                    ),
                    border: "1px dashed rgba(255,255,255,0.5)",
                  }}
                >
                  {/* Section count in compact mode with responsive sizing */}
                  <div
                    className={`text-white font-bold ${getNumberSize(
                      pitchDimensions.width
                    )} drop-shadow-lg`}
                  >
                    {section.total}
                  </div>
                </div>
              ))}

              {/* Section labels - Minimal in compact mode */}
              {sectionData.map((section, index) => (
                <div
                  key={section.name}
                  className="absolute top-1 text-white text-xs font-bold bg-black/50 px-1 py-0.5 rounded"
                  style={{
                    left: `${
                      ((section.minX + section.maxX) /
                        2 /
                        pitchDimensions.width) *
                      100
                    }%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  {section.name.split(" ")[0]}
                </div>
              ))}
            </div>
          )}
        </FootballPitch>
      </div>
    );
  }

  // Full mode rendering
  return (
    <Card className={className + "border-0"}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl">
          {category} Distribution
        </CardTitle>
        {/* <p className="text-xs sm:text-sm text-muted-foreground">
          {sections} pitch sections • {totalCount} events
        </p> */}
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Subcategory Selection - Only show on larger screens */}
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
                    id={subcat}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <Label htmlFor={subcat} className="text-xs sm:text-sm">
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
            {pitchDimensions && (
              <div className="absolute inset-0 pointer-events-auto">
                {sectionData.map((section, index) => (
                  <div
                    key={section.name}
                    className="absolute top-0 bottom-0 flex items-center justify-center"
                    style={{
                      left: `${(section.minX / pitchDimensions.width) * 100}%`,
                      width: `${
                        ((section.maxX - section.minX) /
                          pitchDimensions.width) *
                        100
                      }%`,
                      backgroundColor: getSectionGradient(
                        section,
                        maxSectionTotal
                      ),
                      border: "1px dashed rgba(255,255,255,0.5)",
                    }}
                  >
                    {/* Section count displayed on the overlay with responsive sizing */}
                    <div
                      className={`text-white font-bold ${getNumberSize(
                        pitchDimensions.width
                      )} drop-shadow-lg`}
                    >
                      {section.total}
                    </div>
                  </div>
                ))}

                {/* Section labels */}
                {sectionData.map((section, index) => (
                  <div
                    key={section.name}
                    className="absolute top-1 sm:top-2 text-white font-bold bg-black/50 px-1 sm:px-2 py-0.5 sm:py-1 rounded"
                    style={{
                      left: `${
                        ((section.minX + section.maxX) /
                          2 /
                          pitchDimensions.width) *
                        100
                      }%`,
                      transform: "translateX(-50%)",
                      fontSize: pitchDimensions.width < 400 ? "10px" : "12px",
                    }}
                  >
                    {section.name}
                  </div>
                ))}
              </div>
            )}
          </FootballPitch>
        </div>

        {/* Percentage Statistics */}
        {totalCount > 0 && showDetails && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {sectionData.map((section, index) => (
              <div
                key={section.name}
                className="text-center p-2 sm:p-3 bg-muted rounded-lg"
              >
                <div className="text-xs sm:text-sm font-semibold truncate">
                  {section.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((section.total / totalCount) * 100).toFixed(0)}% of total
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        {showDetails && (
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500/60 rounded"></div>
              <span>Opponent</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500/60 rounded"></div>
              <span>Middle</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500/60 rounded"></div>
              <span>Self</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DistributionMap;
