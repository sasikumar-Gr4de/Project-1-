// Football position categories
export const POSITION_CATEGORIES = {
  GOALKEEPER: "Goalkeeper",
  DEFENDER: "Defender",
  MIDFIELDER: "Midfielder",
  FORWARD: "Forward",
};

export const DETAILED_POSITIONS = {
  GOALKEEPER: [
    { value: "GK", label: "Goalkeeper (GK)", category: "Goalkeeper" },
  ],
  DEFENDER: [
    { value: "CB", label: "Center Back (CB)", category: "Defender" },
    { value: "RB", label: "Right Back (RB)", category: "Defender" },
    { value: "LB", label: "Left Back (LB)", category: "Defender" },
    { value: "SW", label: "Sweeper (SW)", category: "Defender" },
    { value: "RWB", label: "Right Wing Back (RWB)", category: "Defender" },
    { value: "LWB", label: "Left Wing Back (LWB)", category: "Defender" },
  ],
  MIDFIELDER: [
    {
      value: "CDM",
      label: "Defensive Midfielder (CDM)",
      category: "Midfielder",
    },
    { value: "CM", label: "Center Midfielder (CM)", category: "Midfielder" },
    {
      value: "CAM",
      label: "Attacking Midfielder (CAM)",
      category: "Midfielder",
    },
    { value: "RM", label: "Right Midfielder (RM)", category: "Midfielder" },
    { value: "LM", label: "Left Midfielder (LM)", category: "Midfielder" },
    {
      value: "RWM",
      label: "Right Wing Midfielder (RWM)",
      category: "Midfielder",
    },
    {
      value: "LWM",
      label: "Left Wing Midfielder (LWM)",
      category: "Midfielder",
    },
  ],
  FORWARD: [
    { value: "CF", label: "Center Forward (CF)", category: "Forward" },
    { value: "ST", label: "Striker (ST)", category: "Forward" },
    { value: "RW", label: "Right Winger (RW)", category: "Forward" },
    { value: "LW", label: "Left Winger (LW)", category: "Forward" },
    { value: "SS", label: "Second Striker (SS)", category: "Forward" },
  ],
};

export const ALL_POSITIONS = Object.values(DETAILED_POSITIONS).flat();

export const TOURNAMENT_OPTIONS = [
  { value: "premier-league", label: "Premier League" },
  { value: "championship", label: "Championship" },
  { value: "fa-cup", label: "FA Cup" },
  { value: "league-cup", label: "League Cup" },
  { value: "youth-league", label: "Youth League" },
  { value: "friendly", label: "Friendly Matches" },
];

export const ORGANIZER_OPTIONS = [
  { value: "premier-league", label: "Premier League Organization" },
  { value: "fa", label: "Football Association" },
  { value: "uefa", label: "UEFA" },
  { value: "fifa", label: "FIFA" },
  { value: "local", label: "Local Organization" },
];

export const TEAM_STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "suspended", label: "Suspended", color: "red" },
];

export const PLAYER_STATUS = {
  ACTIVE: "active",
  INJURED: "injured",
  SUSPENDED: "suspended",
  INACTIVE: "inactive",
  TRANSFER_LISTED: "transfer_listed",
};

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: PLAYER_STATUS.ACTIVE, label: "Active" },
  { value: PLAYER_STATUS.INJURED, label: "Injured" },
  { value: PLAYER_STATUS.SUSPENDED, label: "Suspended" },
  { value: PLAYER_STATUS.INACTIVE, label: "Inactive" },
  { value: PLAYER_STATUS.TRANSFER_LISTED, label: "Transfer Listed" },
];

// Event types for match analysis
export const EVENT_TYPES = {
  PASS: "pass",
  SHOT: "shot",
  GOAL: "goal",
  TACKLE: "tackle",
  INTERCEPTION: "interception",
  FOUL: "foul",
  CORNER: "corner",
  FREE_KICK: "free_kick",
  PENALTY: "penalty",
  OFFSIDE: "offside",
  CARD: "card",
  SUBSTITUTION: "substitution",
};

// Player metrics categories
export const METRIC_CATEGORIES = {
  PASSING: "passing",
  SHOOTING: "shooting",
  DEFENSE: "defense",
  POSSESSION: "possession",
  PHYSICAL: "physical",
  OVERALL: "overall",
};

// Match statuses
export const MATCH_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  HALFTIME: "halftime",
  FINISHED: "finished",
  POSTPONED: "postponed",
  CANCELLED: "cancelled",
};

// User roles with descriptions
export const USER_ROLES = {
  ADMIN: {
    value: "admin",
    label: "Administrator",
    description: "Full system access and user management",
  },
  DATA_REVIEWER: {
    value: "data-reviewer",
    label: "Data Reviewer",
    description: "Can review and validate all data",
  },
  ANNOTATOR: {
    value: "annotator",
    label: "Annotator",
    description: "Can tag events and upload match data",
  },
  COACH: {
    value: "coach",
    label: "Coach",
    description: "Team management and player analysis",
  },
  SCOUT: {
    value: "scout",
    label: "Scout",
    description: "Player discovery and talent identification",
  },
  CLIENT: {
    value: "client",
    label: "Client",
    description: "Basic access to view reports and analytics",
  },
};

// Client types
export const CLIENT_TYPES = {
  COACH: "coach",
  PARENT: "parent",
  SCOUT: "scout",
};

// File upload constraints
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/mov", "video/avi"],
  ALLOWED_DATA_TYPES: ["text/csv", "application/json"],
};

// Analytics periods
export const ANALYTICS_PERIODS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "1y": "Last year",
  all: "All time",
};

// Pitch dimensions
export const PITCH_DIMENSIONS = {
  WIDTH: 100,
  HEIGHT: 68,
  REAL_WIDTH: 105, // meters
  REAL_HEIGHT: 68, // meters
};

// Color schemes for teams and visualizations
export const COLOR_SCHEMES = {
  PRIMARY: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"],
  QUALITATIVE: [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
  ],
  SEQUENTIAL: [
    "#f7fbff",
    "#deebf7",
    "#c6dbef",
    "#9ecae1",
    "#6baed6",
    "#4292c6",
    "#2171b5",
    "#08519c",
    "#08306b",
  ],
};

// Default formations
export const DEFAULT_FORMATIONS = {
  "4-3-3": {
    name: "4-3-3",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "RCM",
      "CM",
      "LCM",
      "RW",
      "CF",
      "LW",
    ],
  },
  "4-4-2": {
    name: "4-4-2",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "RM",
      "RCM",
      "LCM",
      "LM",
      "RS",
      "LS",
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1",
    positions: [
      "GK",
      "RB",
      "RCB",
      "LCB",
      "LB",
      "RDM",
      "LDM",
      "RAM",
      "CAM",
      "LAM",
      "CF",
    ],
  },
  "3-5-2": {
    name: "3-5-2",
    positions: [
      "GK",
      "RCB",
      "CB",
      "LCB",
      "RWB",
      "RCM",
      "CM",
      "LCM",
      "LWB",
      "RS",
      "LS",
    ],
  },
};

// Navigation structure
export const NAVIGATION = {
  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    permissions: ["view_dashboard"],
  },
  PLAYERS: {
    path: "/players",
    label: "Players",
    icon: "Users",
    permissions: ["view_players"],
  },
  MATCHES: {
    path: "/matches",
    label: "Matches",
    icon: "Trophy",
    permissions: ["view_matches"],
  },
  TEAMS: {
    path: "/teams",
    label: "Teams",
    icon: "Shield",
    permissions: ["view_players"],
  },
  TOURNAMENTS: {
    path: "/tournaments",
    label: "Tournaments",
    icon: "Award",
    permissions: ["view_matches"],
  },
  ANALYTICS: {
    path: "/analytics",
    label: "Analytics",
    icon: "BarChart3",
    permissions: ["view_analytics"],
  },
  ADMIN: {
    path: "/admin",
    label: "Admin",
    icon: "Settings",
    permissions: ["access_admin_panel"],
    role: "admin",
  },
  DATA_REVIEW: {
    path: "/data-review",
    label: "Data Review",
    icon: "ClipboardCheck",
    permissions: ["review_data"],
    role: "data-reviewer",
  },
};

// Feature flags for gradual rollout
export const FEATURE_FLAGS = {
  ADVANCED_ANALYTICS: true,
  REAL_TIME_UPDATES: true,
  AI_INSIGHTS: false, // Coming soon
  MOBILE_APP: false, // Coming soon
  API_INTEGRATIONS: true,
};

// API endpoints for reference
export const API_ENDPOINTS = {
  AUTH: "/api/auth",
  PLAYERS: "/api/players",
  MATCHES: "/api/matches",
  CLUBS: "/api/clubs",
  TOURNAMENTS: "/api/tournaments",
  ANALYTICS: "/api/analytics",
  UPLOAD: "/api/upload",
  ADMIN: "/api/admin",
};

export default {
  POSITION_CATEGORIES,
  DETAILED_POSITIONS,
  ALL_POSITIONS,
  STATUS_OPTIONS,
  EVENT_TYPES,
  METRIC_CATEGORIES,
  MATCH_STATUS,
  USER_ROLES,
  CLIENT_TYPES,
  UPLOAD_CONFIG,
  ANALYTICS_PERIODS,
  PITCH_DIMENSIONS,
  COLOR_SCHEMES,
  DEFAULT_FORMATIONS,
  NAVIGATION,
  FEATURE_FLAGS,
  API_ENDPOINTS,
};
