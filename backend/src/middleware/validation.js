import Joi from "joi";
import { RESPONSES, VALIDATION_MESSAGES } from "../utils/messages.js";
import { FOOTBALL_POSITIONS, AGE_GROUPS } from "../utils/constants.js";

// Auth validation schemas
export const sendOtpSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
}).or("email", "phone");

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
  otp: Joi.string().length(6).required(),
  player_name: Joi.string().min(2).max(100).optional(),
  date_of_birth: Joi.date().max("now").optional(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .optional(),
  academy: Joi.string().max(200).optional(),
  country: Joi.string().max(100).optional(),
}).or("email", "phone");

// User validation schemas
export const updateProfileSchema = Joi.object({
  player_name: Joi.string().min(2).max(100).optional(),
  date_of_birth: Joi.date().max("now").optional(),
  position: Joi.string()
    .valid(...FOOTBALL_POSITIONS)
    .optional(),
  academy: Joi.string().max(200).optional(),
  country: Joi.string().max(100).optional(),
});

// Upload validation schemas
export const uploadDataSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  match_date: Joi.date().max("now").required(),
  notes: Joi.string().max(1000).optional(),
});

// Report validation schemas
export const generateReportSchema = Joi.object({
  player_data_id: Joi.string().uuid().required(),
  scoring_weights: Joi.object().optional(),
});

/**
 * Generic validation middleware
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: VALIDATION_MESSAGES.INVALID_INPUT,
        errors: errorDetails,
      });
    }

    req.body = value;
    next();
  };
};

/**
 * File validation middleware
 */
// export const validateFileUpload = (req, res, next) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json(RESPONSES.BAD_REQUEST('No files uploaded'));
//   }

//   const allowedVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
//   const allowedDataTypes = ['text/csv', 'application/json'];

//   for (const [fieldName, file] of Object.entries(req.files)) {
//     if (fieldName === 'video_file' && !allowedVideoTypes.includes(file.mimetype)) {
//       return res.status(400).json(RESPONSES.BAD_REQUEST('Invalid video file type'));
//     }

//     if (fieldName === 'gps_file' && !allowedDataTypes.includes(file.mimetype)) {
//       return res.status(400).json(RESPONSES.BAD_REQUEST('Invalid data file type'));
//     }

//     // Check file size (50MB max for video, 10MB for data)
//     const maxSize = fieldName === 'video_file' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
//     if (file.size > maxSize) {
//       return res.status(400).json(RESPONSES.BAD_REQUEST('File size too large'));
//     }
//   }

//   next();
// };
