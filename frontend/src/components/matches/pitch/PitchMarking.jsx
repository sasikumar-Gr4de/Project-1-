import React from "react";

const PitchMarkings = React.memo(() => (
  <div className="absolute inset-0 border-2 border-white/20 rounded-lg overflow-hidden">
    {/* Grass Pattern */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
    </div>

    {/* Outer Boundary */}
    <div className="absolute inset-2 border-2 border-white/20 rounded-lg"></div>

    {/* Half-way Line */}
    <div className="absolute top-1/2 left-2 right-2 border-t-2 border-white/20"></div>

    {/* Center Circle */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full"></div>

    {/* Center Spot */}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white/60 rounded-full"></div>

    {/* Penalty Areas */}
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-t-0 rotate-180"></div>
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-48 h-20 border-2 border-white/20 border-b-0 rotate-180"></div>

    {/* Goal Areas */}
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/20 border-t-0 rotate-180"></div>
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-8 border-2 border-white/20 border-b-0 rotate-180"></div>

    {/* Penalty Spots */}
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>

    {/* Penalty Arcs */}
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-12 border-t-2 border-white/20 rounded-t-full overflow-hidden"></div>
    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-12 border-b-2 border-white/20 rounded-b-full overflow-hidden"></div>

    {/* Goals */}
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/40"></div>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/40"></div>
  </div>
));

export default PitchMarkings;
