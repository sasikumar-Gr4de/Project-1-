import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DistributionMap from "@/components/players/DistributionMap";
import PlayerVectorField from "@/components/players/PlayerVectorField";
import PlayerActivityField from "@/components/players/PlayerActivityField";

const PlayerProfilePage = ({ player, player_events }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    Passing: true,
    Shooting: false,
    Defending: false,
    Physical: false,
    Dribbling: false,
    "Ball Carry": false,
    Goalkeeping: false,
    "Special Actions": false,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const categories = [
    "Passing",
    "Shooting",
    "Defending",
    "Physical",
    "Dribbling",
    "Ball Carry",
    "Goalkeeping",
    "Special Actions",
  ];

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-expand first category with data on mobile
  useEffect(() => {
    if (isMobile) {
      const firstCategoryWithData = categories.find(
        (category) =>
          player_events?.[category] &&
          Object.keys(player_events[category]).length > 0
      );

      if (firstCategoryWithData && !expandedCategories[firstCategoryWithData]) {
        setExpandedCategories((prev) => ({
          ...prev,
          [firstCategoryWithData]: true,
        }));
      }
    }
  }, [isMobile, player_events]);

  // Safe data counting functions
  const getTotalEvents = (category) => {
    const categoryData = player_events?.[category] || {};
    let total = 0;
    Object.values(categoryData).forEach((subcategoryData) => {
      Object.values(subcategoryData).forEach((events) => {
        if (Array.isArray(events)) {
          total += events.length;
        }
      });
    });
    return total;
  };

  const getSubcategoryCount = (category) => {
    const categoryData = player_events?.[category] || {};
    return Object.keys(categoryData).length;
  };

  const getActionTypesCount = (category) => {
    const categoryData = player_events?.[category] || {};
    const actionTypes = new Set();
    Object.values(categoryData).forEach((subcategoryData) => {
      Object.keys(subcategoryData).forEach((actionType) => {
        actionTypes.add(actionType);
      });
    });
    return actionTypes.size;
  };

  const getTotalSubcategories = () => {
    return categories.reduce((total, category) => {
      const categoryData = player_events?.[category] || {};
      return total + Object.keys(categoryData).length;
    }, 0);
  };

  const getCategoriesWithData = () => {
    return categories.filter(
      (category) =>
        player_events?.[category] &&
        Object.keys(player_events[category]).length > 0
    ).length;
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    categories.forEach((category) => {
      allExpanded[category] = true;
    });
    setExpandedCategories(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    categories.forEach((category) => {
      allCollapsed[category] = false;
    });
    setExpandedCategories(allCollapsed);
  };

  // Determine visualization layout based on screen size
  const getVisualizationLayout = () => {
    if (isMobile) return "stack";
    if (isTablet) return "grid-2";
    return "grid-3";
  };

  const visualizationLayout = getVisualizationLayout();

  return (
    <div className="space-y-4 sm:space-y-6 p-3">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            Player Analysis
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Performance across {getCategoriesWithData()} categories
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={expandAll}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "sm" : "default"}
            onClick={collapseAll}
            className="flex-1 sm:flex-none text-xs sm:text-sm"
          >
            Collapse All
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3 sm:space-y-4">
        {categories.map((category) => {
          const hasData =
            player_events?.[category] &&
            Object.keys(player_events[category]).length > 0;
          const totalEvents = getTotalEvents(category);

          return (
            <div
              key={category}
              className="border rounded-lg overflow-hidden bg-card"
            >
              {/* Category Header */}
              <div
                className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 hover:bg-muted/70 cursor-pointer transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {expandedCategories[category] ? (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold truncate">
                      {category}
                    </h3>
                    {!isMobile && (
                      <p className="text-xs text-muted-foreground">
                        {getSubcategoryCount(category)} subcategories •{" "}
                        {totalEvents} events
                      </p>
                    )}
                  </div>

                  {/* Mobile badges */}
                  {/* {isMobile && (
                    <div className="flex gap-1 shrink-0">
                      <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {getSubcategoryCount(category)}
                      </span>
                      {!hasData && (
                        <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          No Data
                        </span>
                      )}
                    </div>
                  )} */}

                  {/* Desktop badges */}
                  {/* {!isMobile && (
                    <>
                      <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full whitespace-nowrap">
                        {getSubcategoryCount(category)} subcategories
                      </span>
                      {!hasData && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                          No Data
                        </span>
                      )}
                    </>
                  )} */}
                </div>

                {/* {!isMobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                    <span>
                      {expandedCategories[category] ? "Collapse" : "Expand"}
                    </span>
                  </div>
                )} */}
              </div>

              {/* Category Content */}
              {expandedCategories[category] && (
                <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                  {hasData ? (
                    <>
                      {/* Visualizations - Fixed height containers */}
                      <div
                        className={`
                        ${
                          visualizationLayout === "stack"
                            ? "grid grid-cols-1 gap-4"
                            : ""
                        }
                        ${
                          visualizationLayout === "grid-2"
                            ? "grid grid-cols-2 gap-4"
                            : ""
                        }
                        ${
                          visualizationLayout === "grid-3"
                            ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                            : ""
                        }
                      `}
                      >
                        {/* Distribution Map */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">
                            Distribution
                          </h4>
                          <div className="h-48 sm:h-56 bg-muted/20 rounded-lg border overflow-hidden p-1">
                            <DistributionMap
                              eventsData={player_events}
                              category={category}
                              sections={isMobile ? 2 : 3}
                              className="h-full w-full"
                              compactMode={true}
                            />
                          </div>
                        </div>

                        {/* Vector Field */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">
                            Vectors
                          </h4>
                          <div className="h-48 sm:h-56 bg-muted/20 rounded-lg border overflow-hidden p-1">
                            <PlayerVectorField
                              eventsData={player_events}
                              category={category}
                              className="h-full w-full"
                              compactMode={true}
                            />
                          </div>
                        </div>

                        {/* Activity Field */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">
                            Activity
                          </h4>
                          <div className="h-48 sm:h-56 bg-muted/20 rounded-lg border overflow-hidden p-1">
                            <PlayerActivityField
                              eventsData={player_events}
                              category={category}
                              className="h-full w-full"
                              compactMode={true}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats - Only show on larger screens in compact mode */}
                      {!isMobile && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t">
                          <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg sm:text-2xl font-bold text-blue-600">
                              {getTotalEvents(category)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Events
                            </div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                            <div className="text-lg sm:text-2xl font-bold text-green-600">
                              {getSubcategoryCount(category)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Subcategories
                            </div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg sm:text-2xl font-bold text-purple-600">
                              {getActionTypesCount(category)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Actions
                            </div>
                          </div>
                          <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg sm:text-2xl font-bold text-orange-600">
                              {category}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Category
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8 sm:py-12 bg-muted/20 rounded-lg border-2 border-dashed">
                      <div className="text-muted-foreground text-sm sm:text-base">
                        No data for {category}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                        No recorded events in this category
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 p-4 sm:p-6 bg-muted/30 rounded-lg">
        <div className="text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            {categories.length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Categories
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            {Object.values(expandedCategories).filter(Boolean).length}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Expanded
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            {getTotalSubcategories()}
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Subcategories
          </div>
        </div>
      </div>

      {/* Mobile Helper Text */}
      {isMobile && (
        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            💡 Tap categories to expand. Focus on one category at a time for
            best experience.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlayerProfilePage;
