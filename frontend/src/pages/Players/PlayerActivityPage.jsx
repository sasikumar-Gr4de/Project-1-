import { useState } from "react";

import PlayerActivityField from "@/components/players/PlayerActivityField";

const PlayerProfile = ({ player_events }) => {
  const [selectedCategory, setSelectedCategory] = useState("Passing");

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

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Select Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <PlayerActivityField
        eventsData={player_events}
        category={selectedCategory}
      />
    </div>
  );
};

export default PlayerProfile;
