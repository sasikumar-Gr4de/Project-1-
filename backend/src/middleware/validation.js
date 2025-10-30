import Joi from "joi";
import { RESPONSES, VALIDATION_MESSAGES } from "../utils/messages.js";
import {
  FOOTBALL_POSITIONS,
  COUNTRIES,
  ACADEMIES,
} from "../utils/constants.js";

// Common validation patterns
const commonPatterns = {
  uuid: Joi.string().uuid({ version: "uuidv4" }),
  email: Joi.string().email().max(255).trim().lowercase(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .max(20), // E.164 format
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .pattern(/^[a-zA-Z\s\-'.]+$/),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  otp: Joi.string().length(6).pattern(/^\d+$/),
  date: Joi.date().max("now"),
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .max(500),
  text: Joi.string().max(1000).trim(),
};

// Auth validation schemas
export const sendOtpSchema = Joi.object({
  email: commonPatterns.email.optional(),
  phone: commonPatterns.phone.optional(),
})
  .or("email", "phone")
  .messages({
    "object.missing": "Either email or phone must be provided",
    "string.email": "Please provide a valid email address",
    "string.pattern.base":
      "Please provide a valid phone number in international format",
  });

export const verifyOtpSchema = Joi.object({
  email: commonPatterns.email.optional(),
  phone: commonPatterns.phone.optional(),
  otp: commonPatterns.otp.required().messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
  }),
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
})
  .or("email", "phone")
  .messages({
    "object.missing": "Either email or phone must be provided for verification",
  });

// User validation schemas
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
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const createUserSchema = Joi.object({
  email: commonPatterns.email.required(),
  phone: commonPatterns.phone.optional(),
  player_name: commonPatterns.name.required(),
  date_of_birth: commonPatterns.date.required(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .required(),
  academy: Joi.string().max(200).trim().required(),
  country: Joi.string()
    .valid(...COUNTRIES)
    .required(),
  role: Joi.string().valid("player", "admin", "coach").default("player"),
});

// Upload validation schemas
export const uploadDataSchema = Joi.object({
  user_id: commonPatterns.uuid.required(),
  match_date: commonPatterns.date.required(),
  opponent: commonPatterns.name.optional(),
  location: Joi.string().max(200).optional(),
  notes: commonPatterns.text.optional(),
  video_url: commonPatterns.url.optional(),
  metadata: Joi.object().optional(),
});

// Report validation schemas
export const generateReportSchema = Joi.object({
  player_data_id: commonPatterns.uuid.required(),
  scoring_weights: Joi.object({
    technical: Joi.number().min(0).max(1).default(0.4),
    tactical: Joi.number().min(0).max(1).default(0.3),
    physical: Joi.number().min(0).max(1).default(0.2),
    mental: Joi.number().min(0).max(1).default(0.1),
  }).optional(),
  include_comparison: Joi.boolean().default(false),
  benchmark_age_group: Joi.string().max(50).optional(),
});

// Session and token schemas
export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required().messages({
    "string.empty": "Refresh token is required",
    "any.required": "Refresh token is required",
  }),
});

export const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: commonPatterns.password.required(),
  confirm_password: Joi.any()
    .equal(Joi.ref("new_password"))
    .required()
    .messages({ "any.only": "Confirm password must match new password" }),
});

// Admin validation schemas
export const adminCreateUserSchema = createUserSchema.keys({
  role: Joi.string().valid("player", "admin", "coach").required(),
  send_invite: Joi.boolean().default(true),
});

export const adminUpdateUserSchema = Joi.object({
  player_name: commonPatterns.name.optional(),
  email: commonPatterns.email.optional(),
  phone: commonPatterns.phone.optional(),
  role: Joi.string().valid("player", "admin", "coach").optional(),
  is_active: Joi.boolean().optional(),
  academy: Joi.string().max(200).trim().optional(),
  country: Joi.string()
    .valid(...COUNTRIES)
    .optional(),
}).min(1);

// Query parameter validation schemas
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
}).and("start_date", "end_date");

/**
 * Enhanced validation middleware with better error handling
 */
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false,
      convert: true, // Convert types when possible
    });

    if (error) {
      const errorDetails = error.details.map((detail) => {
        const path = detail.path.join(".");
        return {
          field: path || "unknown",
          message: detail.message,
          type: detail.type,
          value: detail.context?.value,
        };
      });

      // Log validation errors for monitoring
      console.warn("Validation failed:", {
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
        timestamp: new Date().toISOString(),
      });
    }

    // Replace the validated data
    req[source] = value;
    next();
  };
};

/**
 * Validate request parameters
 */
export const validateParams = (schema) => validate(schema, "params");

/**
 * Validate query parameters
 */
export const validateQuery = (schema) => validate(schema, "query");

/**
 * Validate file uploads
 */
export const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
      error: "MISSING_FILE",
    });
  }

  // Validate file type and size
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "application/pdf",
  ];
  const maxSize = 50 * 1024 * 1024; // 50MB

  const files = req.file
    ? [req.file]
    : req.files
    ? Object.values(req.files).flat()
    : [];

  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type ${file.mimetype} is not allowed`,
        error: "INVALID_FILE_TYPE",
        allowedTypes,
      });
    }

    if (file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`,
        error: "FILE_TOO_LARGE",
        maxSize,
      });
    }
  }

  next();
};

/**
 * Sanitize input data to prevent XSS and injection attacks
 */
export const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;

    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "string") {
        // Basic XSS prevention - escape dangerous characters
        obj[key] = obj[key]
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;")
          .replace(/\//g, "&#x2F;")
          .trim();
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    });
  };

  ["body", "params", "query"].forEach((source) => {
    if (req[source]) {
      sanitize(req[source]);
    }
  });

  next();
};

// Export all schemas for use in other files
export default {
  // Auth
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  changePasswordSchema,

  // Users
  updateProfileSchema,
  createUserSchema,

  // Uploads
  uploadDataSchema,

  // Reports
  generateReportSchema,

  // Admin
  adminCreateUserSchema,
  adminUpdateUserSchema,

  // Query
  paginationSchema,
  dateRangeSchema,

  // Middleware
  validate,
  validateParams,
  validateQuery,
  validateFile,
  sanitizeInput,
};
