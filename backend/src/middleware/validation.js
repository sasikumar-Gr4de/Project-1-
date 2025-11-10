// middleware/validation.js - Enhanced for /api routes
import Joi from "joi";
import { VALIDATION_MESSAGES } from "../utils/messages.js";
import { FOOTBALL_POSITIONS, COUNTRIES } from "../utils/constants.js";

// Common validation patterns for API
const commonPatterns = {
  uuid: Joi.string().uuid({ version: "uuidv4" }),
  email: Joi.string().email().max(255).trim().lowercase(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .max(20),
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s\-'.]+$/),
  password: Joi.string().min(8).max(128),
  otp: Joi.string().length(6).pattern(/^\d+$/),
  date: Joi.date().max("now"),
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .max(500),
  text: Joi.string().max(1000).trim(),
};

// API Auth validation schemas
export const sendOtpSchema = Joi.object({
  email: commonPatterns.email.optional(),
  phone: commonPatterns.phone.optional(),
})
  .or("email", "phone")
  .messages({
    "object.missing": "Either email or phone must be provided for OTP",
  });

export const verifyOtpSchema = Joi.object({
  email: commonPatterns.email.optional(),
  phone: commonPatterns.phone.optional(),
  otp: commonPatterns.otp.required(),
  player_name: commonPatterns.name.optional(),
  date_of_birth: commonPatterns.date.optional(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .optional(),
  academy: Joi.string().max(200).trim().optional(),
  country: Joi.string()
    .valid(...COUNTRIES)
    .optional(),
}).or("email", "phone");

// API User validation schemas
export const updateProfileSchema = Joi.object({
  player_name: commonPatterns.name.optional(),
  date_of_birth: commonPatterns.date.optional(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .optional(),
  academy: Joi.string().max(200).trim().optional(),
  country: Joi.string()
    .valid(...COUNTRIES)
    .optional(),
  avatar_url: commonPatterns.url.optional(),
  bio: commonPatterns.text.optional(),
}).min(1);

// API Upload validation schemas
export const uploadDataSchema = Joi.object({
  user_id: commonPatterns.uuid.required(),
  match_date: commonPatterns.date.required(),
  opponent: commonPatterns.name.optional(),
  location: Joi.string().max(200).optional(),
  notes: commonPatterns.text.optional(),
  video_url: commonPatterns.url.optional(),
});

// API Report validation schemas
export const generateReportSchema = Joi.object({
  player_data_id: commonPatterns.uuid.required(),
  scoring_weights: Joi.object({
    technical: Joi.number().min(0).max(1).default(0.4),
    tactical: Joi.number().min(0).max(1).default(0.3),
    physical: Joi.number().min(0).max(1).default(0.2),
    mental: Joi.number().min(0).max(1).default(0.1),
  }).optional(),
});

// API Token schemas
export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

// API Query parameter validation
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().max(100).optional(),
  order: Joi.string().valid("asc", "desc").default("desc"),
  search: Joi.string().max(100).trim().optional(),
});

export const dateRangeSchema = Joi.object({
  start_date: commonPatterns.date.required(),
  end_date: commonPatterns.date.required().min(Joi.ref("start_date")),
});

/**
 * Enhanced validation middleware for API routes
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    // Only validate API routes
    if (!req.path.startsWith("/api")) {
      return next();
    }

    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
      convert: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => {
        const path = detail.path.join(".");
        return {
          field: path || "unknown",
          message: detail.message,
          type: detail.type,
        };
      });

      console.warn("API validation failed:", {
        path: req.path,
        method: req.method,
        errors: errorDetails,
        user: req.user?.id || "anonymous",
      });

      return res.status(400).json({
        success: false,
        message: VALIDATION_MESSAGES.INVALID_INPUT,
        error: "VALIDATION_ERROR",
        errors: errorDetails,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }

    req[source] = value;
    next();
  };
};

/**
 * Validate API request parameters
 */
export const validateParams = (schema) => validate(schema, "params");

/**
 * Validate API query parameters
 */
export const validateQuery = (schema) => validate(schema, "query");

/**
 * Validate API file uploads
 */
export const validateApiFile = (req, res, next) => {
  // Only validate for API routes
  if (!req.path.startsWith("/api")) {
    return next();
  }

  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
      error: "MISSING_FILE",
      path: req.path,
    });
  }

  next();
};

export const createDataSchema = Joi.object({
  match_date: commonPatterns.date.required(),
  jersey_number: Joi.number().integer().min(1).max(99).required(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .required(),
  jersey_color: Joi.string().max(50).required(),
  opponent_jersey_color: Joi.string().max(50).required(),
  notes: commonPatterns.text.optional(),
  video: commonPatterns.url.optional(),
  gps: Joi.object().optional(),
});

export const changeDataStatusSchema = Joi.object({
  status: Joi.string()
    .valid("uploaded", "processing", "completed", "failed")
    .required(),
});

export const updateIdentitySchema = Joi.object({
  first_name: commonPatterns.name.optional(),
  last_name: commonPatterns.name.optional(),
  dob: commonPatterns.date.optional(),
  nationality: Joi.string().max(100).optional(),
  height_cm: Joi.number().integer().min(100).max(250).optional(),
  weight_kg: Joi.number().integer().min(30).max(150).optional(),
  preferred_foot: Joi.string().valid("left", "right", "both").optional(),
  positions: Joi.array().items(Joi.string().max(50)).optional(),
  headshot_url: commonPatterns.url.optional(),
  guardian_name: commonPatterns.name.optional(),
  guardian_email: commonPatterns.email.optional(),
  guardian_phone: commonPatterns.phone.optional(),
}).min(1);

export const uploadHeadshotSchema = {
  body: Joi.object({
    headshot_url: Joi.string().uri().required(),
  }),
};

export const ingestMetricsSchema = Joi.object({
  match_id: commonPatterns.uuid.optional(),
  date: commonPatterns.date.required(),
  competition: Joi.string().max(200).required(),
  minutes: Joi.number().integer().min(0).max(120).required(),
  gps_summary: Joi.object({
    distance_m: Joi.number().min(0),
    hsr_m: Joi.number().min(0).optional(),
    sprints: Joi.number().integer().min(0).optional(),
    top_speed_ms: Joi.number().min(0).optional(),
  }).optional(),
  event_summary: Joi.object({
    passes_completed: Joi.number().integer().min(0).optional(),
    passes_attempted: Joi.number().integer().min(0).optional(),
    shots: Joi.number().integer().min(0).optional(),
    tackles: Joi.number().integer().min(0).optional(),
    duels_won: Joi.number().integer().min(0).optional(),
    interceptions: Joi.number().integer().min(0).optional(),
  }).optional(),
  gr4de_score: Joi.number().min(0).max(100).required(),
  benchmarks: Joi.object().optional(),
  source: Joi.string()
    .valid("catapult", "playmaker", "stepout", "manual")
    .required(),
  raw_file_url: commonPatterns.url.optional(),
});

export const uploadVerificationSchema = Joi.object({
  document_type: Joi.string()
    .valid("passport", "club_letter", "consent")
    .required(),
  file_url: commonPatterns.url.required(),
  hash_sha256: Joi.string().length(64).optional(), // SHA256 hash
});

export const reviewVerificationSchema = Joi.object({
  action: Joi.string().valid("approved", "rejected").required(),
  note: Joi.string().max(500).optional(),
});

// Upload schema for video + data processing
export const uploadSchema = Joi.object({
  video_url: commonPatterns.url.optional(),
  gps_url: commonPatterns.url.optional(),
  event_json: Joi.object().optional(),
  match_date: commonPatterns.date.required(),
  upload_source: Joi.string().max(50).default("web"),
  metadata: Joi.object({
    competition: Joi.string().max(200).optional(),
    opponent: Joi.string().max(200).optional(),
    location: Joi.string().max(200).optional(),
    minutes: Joi.number().integer().min(0).max(120).optional(),
  }).optional(),
}).or("video_url", "gps_url"); // At least one of video or GPS data required

// Export all API schemas
export default {
  // Auth
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,

  // Users
  updateProfileSchema,

  // Uploads
  uploadDataSchema,

  // Reports
  generateReportSchema,

  // Query
  paginationSchema,
  dateRangeSchema,

  // Middleware
  validate,
  validateParams,
  validateQuery,
  validateApiFile,

  // Player Data
  createDataSchema,
  changeDataStatusSchema,

  updateIdentitySchema,
  ingestMetricsSchema,
  uploadVerificationSchema,
  reviewVerificationSchema,
};
