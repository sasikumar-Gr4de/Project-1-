// src/components/benchmarks/PillarCard.jsx - Updated for smaller size
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PillarCard = ({ name, yourScore, average, top10, color }) => {
  return (
    <Card className="bg-black/60">
      <CardHeader className="pb-1">
        <CardTitle
          className={`text-base font-bold bg-linear-to-r ${color} bg-clip-text text-transparent`}
        >
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-center items-center">
          <div className="text-center w-36 h-36 rounded-full p-1 bg-linear-to-b from-primary bg-green-700">
            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center">
              <div className="text-4xl font-bold bg-linear-to-r from-primary to-primary-300 text-transparent bg-clip-text font-['Orbitron']">
                {yourScore}
              </div>
              <div className="text-xs font-bold text-placeholder mt-1">
                Your Score
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-placeholder">Avg: {average}</span>
            <span className="text-placeholder">Top: {top10}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PillarCard;
