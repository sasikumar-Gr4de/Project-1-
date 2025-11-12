// src/components/ui/charts/PillarCard.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PillarCard = ({ name, yourScore, average, top10, color }) => {
  return (
    <Card className="bg-[#1A1A1A] border-[#343434]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div
            className={`text-3xl font-bold bg-linear-to-r ${color} bg-clip-text text-transparent`}
          >
            {yourScore}
          </div>
          <div className="text-sm text-placeholder mt-1">Your Score</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-placeholder">Avg: {average}</span>
            <span className="text-placeholder">Top: {top10}</span>
          </div>
          <Progress
            value={yourScore}
            className={`h-2 bg-linear-to-r ${color} rounded-full`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PillarCard;
