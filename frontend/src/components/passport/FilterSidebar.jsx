import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, RotateCcw } from "lucide-react";

const FilterSidebar = ({
  selectedSeason,
  onSeasonChange,
  selectedDateRange,
  onDateRangeChange,
  onResetFilters,
  metrics = [],
}) => {
  const seasons = [
    { value: "2025-26", label: "2025-26" },
    { value: "2024-25", label: "2024-25" },
    { value: "2023-24", label: "2023-24" },
  ];

  const dateRanges = [
    { value: "last-7-days", label: "Last 7 Days" },
    { value: "last-30-days", label: "Last 30 Days" },
    { value: "last-90-days", label: "Last 90 Days" },
    { value: "season", label: "Current Season" },
    { value: "all", label: "All Time" },
  ];

  const totalMatches = metrics.length;
  const avgScore =
    metrics.length > 0
      ? (
          metrics.reduce((sum, m) => sum + m.gr4de_score, 0) / metrics.length
        ).toFixed(1)
      : 0;

  return (
    <Card className="bg-(--surface-1) border-(--surface-2) hover:border-primary/30 transition-all duration-300 rounded-xl py-5">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Filter className="w-5 h-5 text-primary" />
          <span>Filters & Stats</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Season Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Season</label>
          <Select value={selectedSeason} onValueChange={onSeasonChange}>
            <SelectTrigger className="bg-[#1A1A1A] border-border text-white">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-border text-white">
              {seasons.map((season) => (
                <SelectItem
                  key={season.value}
                  value={season.value}
                  className="focus:bg-[#343434] focus:text-primary"
                >
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Date Range</label>
          <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
            <SelectTrigger className="bg-[#1A1A1A] border-border text-white">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-border text-white">
              {dateRanges.map((range) => (
                <SelectItem
                  key={range.value}
                  value={range.value}
                  className="focus:bg-[#343434] focus:text-primary"
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-medium text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Quick Stats</span>
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-placeholder">Total Matches</span>
              <Badge
                variant="outline"
                className="bg-primary/20 text-primary border-primary/30"
              >
                {totalMatches}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-placeholder">Avg GR4DE Score</span>
              <Badge
                variant="outline"
                className="bg-green-500/20 text-green-400 border-green-500/30"
              >
                {avgScore}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-placeholder">Current Form</span>
              <Badge
                variant="outline"
                className="bg-blue-500/20 text-blue-400 border-blue-500/30"
              >
                {totalMatches > 0 ? "Active" : "No Data"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Reset Filters */}
        {/* <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="w-full bg-[#1A1A1A] border-border text-white hover:bg-[#343434]"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Filters
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
