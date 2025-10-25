import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FootballPitch from "@/components/common/FootballPitch";

const DistributionMap = ({
  eventsData = {},
  category = "Passing",
  sections = 3, // 2 or 3 sections
  className = "",
}) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [pitchDimensions, setPitchDimensions] = useState(null);

  // Get available subcategories for the selected category
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

  // Process data for distribution
  const processDistributionData = () => {
    if (!pitchDimensions) return { sections: [], totalCount: 0 };

    const { width: pitchWidth, height: pitchHeight } = pitchDimensions;

    // Define section boundaries (attack direction: right to left)
    const sectionBoundaries =
      sections === 3
        ? [
            { name: "Opponent Penalty Box", minX: 0, maxX: pitchWidth * 0.2 },
            {
              name: "Middle Box",
              minX: pitchWidth * 0.2,
              maxX: pitchWidth * 0.8,
            },
            {
              name: "Self Penalty Box",
              minX: pitchWidth * 0.8,
              maxX: pitchWidth,
            },
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

    // Process events from selected subcategories
    Object.entries(selectedSubcategories).forEach(([subcat, isSelected]) => {
      if (!isSelected) return;

      const subcategoryData = categoryData[subcat];
      if (!subcategoryData) return;

      Object.entries(subcategoryData).forEach(([actionType, events]) => {
        events.forEach((event) => {
          if (!event.position_x || !event.position_y) return;

          // Convert coordinates to pitch pixels (x: 0-110 → 0-pitchWidth, y: 0-68 → 0-pitchHeight)
          const pixelX = (event.position_x / 110) * pitchWidth;
          const pixelY = (event.position_y / 68) * pitchHeight;

          // Find which section this event belongs to
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

  // Calculate gradient colors based on density
  const getSectionGradient = (section, maxDensity) => {
    const density = section.total / maxDensity;
    const opacity = Math.min(0.6, density * 0.8);

    if (section.name.includes("Opponent")) {
      return `rgba(239, 68, 68, ${opacity})`; // Red for opponent areas
    } else if (section.name.includes("Self")) {
      return `rgba(34, 197, 94, ${opacity})`; // Green for self areas
    } else {
      return `rgba(59, 130, 246, ${opacity})`; // Blue for middle areas
    }
  };

  const handleSubcategoryToggle = (subcategory) => {
    setSelectedSubcategories((prev) => ({
      ...prev,
      [subcategory]: !prev[subcategory],
    }));
  };

  const maxSectionTotal = Math.max(...sectionData.map((s) => s.total), 1);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{category} Distribution Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing distribution across {sections} pitch sections
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
                    id={subcat}
                    checked={selectedSubcategories[subcat] || false}
                    onCheckedChange={() => handleSubcategoryToggle(subcat)}
                  />
                  <Label htmlFor={subcat} className="text-sm">
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
                <div className="absolute inset-0 pointer-events-auto">
                  {/* Section overlays */}
                  {sectionData.map((section, index) => (
                    <div
                      key={section.name}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${
                          (section.minX / pitchDimensions.width) * 100
                        }%`,
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
                    />
                  ))}

                  {/* Section labels */}
                  {sectionData.map((section, index) => (
                    <div
                      key={section.name}
                      className="absolute top-2 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded"
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
                      {section.name}
                    </div>
                  ))}
                </div>
              )}
            </FootballPitch>
          </div>

          {/* Statistics */}
          {totalCount > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sectionData.map((section, index) => (
                <div
                  key={section.name}
                  className="text-center p-4 bg-muted rounded-lg"
                >
                  <div className="text-lg font-bold">{section.name}</div>
                  <div className="text-2xl font-bold text-primary mt-2">
                    {section.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {((section.total / totalCount) * 100).toFixed(1)}% of total
                  </div>

                  {/* Action type breakdown */}
                  {Object.entries(section.counts).length > 0 && (
                    <div className="mt-3 text-xs">
                      {Object.entries(section.counts).map(([action, count]) => (
                        <div key={action} className="flex justify-between">
                          <span>{action}:</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex justify-center items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/60 rounded"></div>
              <span>Opponent Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/60 rounded"></div>
              <span>Middle Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/60 rounded"></div>
              <span>Self Areas</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DistributionMap;
