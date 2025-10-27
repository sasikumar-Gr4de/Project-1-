export const FOOTBALL_POSITIONS = [
  {
    position: "Goalkeeper",
    abbreviation: "GK",
    description: "The last line of defence; guards the goal",
  },
  {
    position: "Center Back",
    abbreviation: "CB",
    description:
      "Main central defender who stops attackers and clears the ball",
  },
  {
    position: "Left Back",
    abbreviation: "LB",
    description: "Defends the left side and supports attacks down the wing",
  },
  {
    position: "Right Back",
    abbreviation: "RB",
    description: "Defends the right side and supports forward plays",
  },
  {
    position: "Sweeper",
    abbreviation: "SW",
    description: "Plays behind the center backs to sweep up loose balls",
  },
  {
    position: "Left Wing Back",
    abbreviation: "LWB",
    description:
      "Hybrid between left back and winger; attacks and defends the left flank",
  },
  {
    position: "Right Wing Back",
    abbreviation: "RWB",
    description:
      "Hybrid between right back and winger; attacks and defends the right flank",
  },
  {
    position: "Central Midfielder",
    abbreviation: "CM",
    description: "Connects defense and attack; controls the game’s flow",
  },
  {
    position: "Defensive Midfielder",
    abbreviation: "CDM",
    description: "Protects the defense and breaks up opposition attacks",
  },
  {
    position: "Attacking Midfielder",
    abbreviation: "CAM",
    description: "Creates scoring chances and supports strikers",
  },
  {
    position: "Left Midfielder",
    abbreviation: "LM",
    description: "Plays wide on the left and supports both defense and attack",
  },
  {
    position: "Right Midfielder",
    abbreviation: "RM",
    description:
      "Plays wide on the right and contributes to attack and defense",
  },
  {
    position: "Box-to-Box Midfielder",
    abbreviation: "B2B",
    description: "Covers the entire pitch, supporting both defense and attack",
  },
  {
    position: "Deep-Lying Playmaker",
    abbreviation: "DLP",
    description:
      "Controls the tempo and distributes the ball from deep positions",
  },
  {
    position: "Wide Playmaker",
    abbreviation: "WP",
    description: "Creates play from wide areas rather than crossing",
  },
  {
    position: "Striker",
    abbreviation: "ST",
    description: "Main goal scorer who leads the attack",
  },
  {
    position: "Center Forward",
    abbreviation: "CF",
    description: "Plays centrally and often drops deep to link up play",
  },
  {
    position: "Second Striker",
    abbreviation: "SS",
    description: "Plays behind the main striker and creates chances",
  },
  {
    position: "Left Winger",
    abbreviation: "LW",
    description:
      "Attacks down the left wing and delivers crosses or cuts inside",
  },
  {
    position: "Right Winger",
    abbreviation: "RW",
    description: "Attacks down the right side and provides pace and assists",
  },
  {
    position: "False Nine",
    abbreviation: "F9",
    description: "Forward who drops deep to pull defenders out of position",
  },
  {
    position: "Target Man",
    abbreviation: "TM",
    description: "Strong striker used for hold-up play and aerial duels",
  },
  {
    position: "Inside Forward",
    abbreviation: "IF",
    description: "Wide attacker who cuts inside to shoot or combine centrally",
  },
];

export const POSITION_CATEGORIES = {
  GOALKEEPER: FOOTBALL_POSITIONS.filter((pos) => pos.abbreviation === "GK"),
  DEFENDERS: FOOTBALL_POSITIONS.filter((pos) =>
    ["CB", "LB", "RB", "SW", "LWB", "RWB"].includes(pos.abbreviation)
  ),
  MIDFIELDERS: FOOTBALL_POSITIONS.filter((pos) =>
    ["CM", "CDM", "CAM", "LM", "RM", "B2B", "DLP", "WP"].includes(
      pos.abbreviation
    )
  ),
  FORWARDS: FOOTBALL_POSITIONS.filter((pos) =>
    ["ST", "CF", "SS", "LW", "RW", "F9", "TM", "IF"].includes(pos.abbreviation)
  ),
};

// Helper function to get position by abbreviation
export const getPositionByAbbreviation = (abbr) => {
  return FOOTBALL_POSITIONS.find((pos) => pos.abbreviation === abbr);
};

// Helper function to get position display text
export const getPositionDisplay = (abbr) => {
  const position = getPositionByAbbreviation(abbr);
  return position ? `${position.abbreviation} - ${position.position}` : abbr;
};

export const FORMATION_POSITIONS = {
  "4-4-2": ["GK", "RB", "CB", "CB", "LB", "RM", "CM", "CM", "LM", "CF", "ST"],
  "4-3-3": ["GK", "RB", "CB", "CB", "LB", "CDM", "CM", "CAM", "RW", "ST", "LW"],
  "4-2-3-1": [
    "GK",
    "RB",
    "CB",
    "CB",
    "LB",
    "CDM",
    "CDM",
    "RM",
    "CAM",
    "LM",
    "ST",
  ],
  "3-5-2": [
    "GK",
    "CB",
    "CB",
    "CB",
    "RWB",
    "CM",
    "CDM",
    "CM",
    "LWB",
    "CF",
    "ST",
  ],
  "3-4-3": ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "LM", "RW", "ST", "LW"],
};

export const PLAYER_FOOT_LIST = ["Left", "Right", "Both"];

export const PLAYER_STATUSES = ["active", "injured", "suspended", "inactive"];
