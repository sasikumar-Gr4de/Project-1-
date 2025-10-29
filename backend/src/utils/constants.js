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

// Processing Queue Status
export const QUEUE_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
};

// Report Status
export const REPORT_STATUS = {
  GENERATING: "generating",
  GENERATED: "generated",
  FAILED: "failed",
};

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  CANCELED: "canceled",
  PAST_DUE: "past_due",
  UNPAID: "unpaid",
};

// Alert Types
export const ALERT_TYPES = {
  EMAIL: "email",
  WHATSAPP: "whatsapp",
};

// Alert Status
export const ALERT_STATUS = {
  PENDING: "pending",
  SENT: "sent",
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

// GR4DE Score Pillars
export const SCORE_PILLARS = {
  TECHNICAL: "technical",
  TACTICAL: "tactical",
  PHYSICAL: "physical",
  MENTAL: "mental",
};

// File Types
export const FILE_TYPES = {
  VIDEO: "video",
  GPS: "gps",
  NOTES: "notes",
};

// Allowed Video MIME Types
export const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/mkv",
  "video/webm",
];

// Allowed Data MIME Types
export const ALLOWED_DATA_TYPES = [
  "text/csv",
  "application/json",
  "application/octet-stream",
];

// File Size Limits (in bytes)
export const FILE_SIZE_LIMITS = {
  VIDEO: 50 * 1024 * 1024, // 50MB
  DATA: 10 * 1024 * 1024, // 10MB
  IMAGE: 5 * 1024 * 1024, // 5MB
};

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS: 5,
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
};

// Rate Limiting Configuration
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  MAX_OTP_REQUESTS: 5,
  MAX_UPLOAD_REQUESTS: 10,
};

// S3 Configuration
export const S3_CONFIG = {
  UPLOAD_FOLDERS: {
    VIDEOS: "videos",
    GPS_DATA: "gps-data",
    REPORTS: "reports",
    AVATARS: "avatars",
  },
  PRESIGNED_URL_EXPIRY: 3600, // 1 hour in seconds
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  PLANS: {
    BASIC: {
      name: "Basic",
      price: 9900, // €99 in cents
      features: ["5 reports per month", "Basic analytics", "Email support"],
    },
    PRO: {
      name: "Pro",
      price: 29900, // €299 in cents
      features: [
        "20 reports per month",
        "Advanced analytics",
        "Priority support",
        "Benchmark comparisons",
      ],
    },
    ELITE: {
      name: "Elite",
      price: 49900, // €499 in cents
      features: [
        "Unlimited reports",
        "Full analytics suite",
        "24/7 support",
        "AI insights",
        "Scout access",
      ],
    },
  },
};

// Scoring Engine Default Weights
export const DEFAULT_SCORING_WEIGHTS = {
  [SCORE_PILLARS.TECHNICAL]: 0.3,
  [SCORE_PILLARS.TACTICAL]: 0.3,
  [SCORE_PILLARS.PHYSICAL]: 0.2,
  [SCORE_PILLARS.MENTAL]: 0.2,
};

// Benchmark Configuration
export const BENCHMARK_CONFIG = {
  MIN_SAMPLES: 1000,
  UPDATE_FREQUENCY: "seasonal", // seasonal, monthly, quarterly
  CONFIDENCE_LEVEL: 0.95,
};

// Notification Templates
export const NOTIFICATION_TEMPLATES = {
  REPORT_READY: {
    EMAIL: {
      subject: "Your GR4DE Report is Ready!",
      template: "report_ready",
    },
    WHATSAPP: {
      template: "report_ready_whatsapp",
    },
  },
  WELCOME: {
    EMAIL: {
      subject: "Welcome to GR4DE Platform!",
      template: "welcome",
    },
    WHATSAPP: {
      template: "welcome_whatsapp",
    },
  },
  SUBSCRIPTION_RENEWAL: {
    EMAIL: {
      subject: "Your GR4DE Subscription is Renewing Soon",
      template: "subscription_renewal",
    },
  },
};

// Countries (Top football countries for dropdowns)
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

// Academies (Example list - can be extended)
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

// Performance Metrics Categories
export const PERFORMANCE_METRICS = {
  TECHNICAL: [
    "ball_control",
    "dribbling",
    "passing_accuracy",
    "shooting_accuracy",
    "first_touch",
    "heading_accuracy",
  ],
  TACTICAL: [
    "positioning",
    "decision_making",
    "vision",
    "game_intelligence",
    "press_resistance",
    "transition_play",
  ],
  PHYSICAL: [
    "speed",
    "stamina",
    "strength",
    "agility",
    "acceleration",
    "jumping",
  ],
  MENTAL: [
    "composure",
    "confidence",
    "leadership",
    "determination",
    "concentration",
    "work_rate",
  ],
};

// Report Insight Types
export const INSIGHT_TYPES = {
  STRENGTH: "strength",
  PRIORITY: "priority",
  OPPORTUNITY: "opportunity",
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "DD MMM YYYY",
  DATABASE: "YYYY-MM-DD",
  TIMESTAMP: "YYYY-MM-DD HH:mm:ss",
};

// Environment Modes
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
};

// Cache Keys
export const CACHE_KEYS = {
  BENCHMARKS: "benchmarks",
  USER_PROFILE: (userId) => `user:${userId}:profile`,
  USER_REPORTS: (userId) => `user:${userId}:reports`,
  SYSTEM_METRICS: "system:metrics",
};

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors
  AUTH_INVALID_OTP: "AUTH_001",
  AUTH_OTP_EXPIRED: "AUTH_002",
  AUTH_USER_EXISTS: "AUTH_003",
  AUTH_USER_NOT_FOUND: "AUTH_004",

  // Validation Errors
  VALIDATION_FAILED: "VAL_001",
  INVALID_FILE_TYPE: "VAL_002",
  FILE_TOO_LARGE: "VAL_003",

  // Upload Errors
  UPLOAD_FAILED: "UPL_001",
  PROCESSING_FAILED: "UPL_002",

  // Subscription Errors
  SUBSCRIPTION_REQUIRED: "SUB_001",
  PLAN_LIMIT_REACHED: "SUB_002",

  // System Errors
  DATABASE_ERROR: "SYS_001",
  EXTERNAL_SERVICE_ERROR: "SYS_002",
};

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: "Operation completed successfully",
  CREATED: "Resource created successfully",
  UPDATED: "Resource updated successfully",
  DELETED: "Resource deleted successfully",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  VALIDATION_ERROR: "Validation failed",
  SERVER_ERROR: "Internal server error",
};

// Feature Flags
export const FEATURE_FLAGS = {
  AI_INSIGHTS: "ai_insights",
  PLAYER_COMPARISON: "player_comparison",
  ADVANCED_ANALYTICS: "advanced_analytics",
  COACH_GPT: "coach_gpt",
  API_ACCESS: "api_access",
};

// Default Limits by Tier
export const TIER_LIMITS = {
  [TIER_PLANS.FREE]: {
    monthlyReports: 1,
    storageGB: 1,
    videoLengthMin: 5,
    support: "email",
  },
  [TIER_PLANS.BASIC]: {
    monthlyReports: 5,
    storageGB: 10,
    videoLengthMin: 15,
    support: "priority_email",
  },
  [TIER_PLANS.PRO]: {
    monthlyReports: 20,
    storageGB: 50,
    videoLengthMin: 30,
    support: "priority_24h",
  },
  [TIER_PLANS.ELITE]: {
    monthlyReports: -1, // unlimited
    storageGB: 100,
    videoLengthMin: 90,
    support: "dedicated_manager",
  },
};

// Export all constants as a single object for easy importing
export default {
  USER_ROLES,
  TIER_PLANS,
  UPLOAD_STATUS,
  QUEUE_STATUS,
  REPORT_STATUS,
  SUBSCRIPTION_STATUS,
  ALERT_TYPES,
  ALERT_STATUS,
  FOOTBALL_POSITIONS,
  AGE_GROUPS,
  SCORE_PILLARS,
  FILE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_DATA_TYPES,
  FILE_SIZE_LIMITS,
  OTP_CONFIG,
  PAGINATION,
  HTTP_STATUS,
  RATE_LIMIT,
  S3_CONFIG,
  STRIPE_CONFIG,
  DEFAULT_SCORING_WEIGHTS,
  BENCHMARK_CONFIG,
  NOTIFICATION_TEMPLATES,
  COUNTRIES,
  ACADEMIES,
  PERFORMANCE_METRICS,
  INSIGHT_TYPES,
  DATE_FORMATS,
  ENVIRONMENT,
  CACHE_KEYS,
  ERROR_CODES,
  API_MESSAGES,
  FEATURE_FLAGS,
  TIER_LIMITS,
};
