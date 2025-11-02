// API Base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// User Roles
export const USER_ROLES = {
  PLAYER: "player",
  COACH: "coach",
  ADMIN: "admin",
};

// Subscription Tier Plans
export const TIER_PLANS = {
  FREE: "free",
  BASIC: "basic",
  PRO: "pro",
  ELITE: "elite",
};

// Upload Status
export const UPLOAD_STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const DATA_STATUS = {
  UPLOADED: "uploaded",
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

export const REPORT_STATUS = {
  GENERATING: "generating",
  GENERATED: "generated",
  FAILED: "failed",
};

// Football Positions
export const FOOTBALL_POSITIONS = [
  "Goalkeeper",
  "Center Back",
  "Full Back",
  "Wing Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Winger",
  "Striker",
  "Forward",
];

// Age Groups
export const AGE_GROUPS = [
  "U13",
  "U14",
  "U15",
  "U16",
  "U17",
  "U18",
  "U19",
  "U21",
  "Senior",
];

// Countries
export const COUNTRIES = [
  "Argentina",
  "Brazil",
  "England",
  "France",
  "Germany",
  "Italy",
  "Netherlands",
  "Portugal",
  "Spain",
  "United States",
  "Canada",
  "Australia",
  "Japan",
  "South Korea",
  "Mexico",
  "Belgium",
  "Croatia",
  "Denmark",
  "Norway",
  "Sweden",
  "Switzerland",
];

// Academies
export const ACADEMIES = [
  "La Masia (FC Barcelona)",
  "Cantera (Real Madrid)",
  "Academy (Manchester City)",
  "Hale End (Arsenal)",
  "Cobham (Chelsea)",
  "Youth Academy (Bayern Munich)",
  "Youth Sector (Juventus)",
  "Youth Academy (Ajax)",
  "Academy (Paris Saint-Germain)",
  "Youth Development (Borussia Dortmund)",
  "Other",
];

// GR4DE Score Pillars
export const SCORE_PILLARS = {
  TECHNICAL: "technical",
  TACTICAL: "tactical",
  PHYSICAL: "physical",
  MENTAL: "mental",
};

// Navigation Items
export const NAV_ITEMS = {
  PLAYER: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Upload Data", href: "/upload", icon: "Upload" },
    { name: "My Reports", href: "/reports", icon: "FileText" },
    { name: "Benchmarks", href: "/benchmarks", icon: "BarChart3" },
    { name: "Profile", href: "/profile", icon: "User" },
  ],
  ADMIN: [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: "LayoutDashboard",
      description: "System overview and metrics",
    },
    {
      name: "Queue Management",
      href: "/admin/queue",
      icon: "Activity",
      description: "Process pending analysis jobs",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: "Users",
      description: "Manage players and accounts",
    },
    {
      name: "Report Management",
      href: "/admin/reports",
      icon: "FileText",
      description: "View and manage all reports",
    },
    {
      name: "System Analytics",
      href: "/admin/analytics",
      icon: "BarChart3",
      description: "Platform performance insights",
    },
    {
      name: "Content Manager",
      href: "/admin/content",
      icon: "Database",
      description: "Manage platform content",
    },
  ],
};

// Plan Features
export const PLAN_FEATURES = {
  [TIER_PLANS.FREE]: {
    name: "Free",
    price: 0,
    features: ["1 report per month", "Basic analytics", "Email support"],
    color: "gray",
  },
  [TIER_PLANS.BASIC]: {
    name: "Basic",
    price: 99,
    features: [
      "5 reports per month",
      "Advanced analytics",
      "Priority support",
      "Benchmark comparisons",
    ],
    color: "green",
  },
  [TIER_PLANS.PRO]: {
    name: "Pro",
    price: 299,
    features: [
      "20 reports per month",
      "Full analytics suite",
      "24/7 support",
      "AI insights",
    ],
    color: "blue",
  },
  [TIER_PLANS.ELITE]: {
    name: "Elite",
    price: 499,
    features: [
      "Unlimited reports",
      "Premium analytics",
      "Dedicated manager",
      "Scout access",
    ],
    color: "purple",
  },
};
