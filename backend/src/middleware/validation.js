import { supabase } from "../config/supabase.js";

export const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: "Page must be greater than 0",
    });
  }

  if (limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: "Limit must be between 1 and 100",
    });
  }

  req.pagination = { page, limit };
  next();
};

export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/mov",
    "video/avi",
    "text/csv",
    "application/json",
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type. Allowed types: images, videos, CSV, JSON",
    });
  }

  const maxSize = 50 * 1024 * 1024; // 50MB
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: "File size too large. Maximum size is 50MB",
    });
  }

  next();
};

export const validateRegistration = (req, res, next) => {
  const { email, password, full_name, role } = req.body;

  const errors = [];

  // Email validation
  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push("Please provide a valid email address");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Full name validation
  if (!full_name || !full_name.trim()) {
    errors.push("Full name is required");
  }

  // Role validation
  const allowedRoles = [
    "admin",
    "data-reviewer",
    "annotator",
    "coach",
    "scout",
    "client",
  ];
  if (!role) {
    errors.push("Role is required");
  } else if (!allowedRoles.includes(role)) {
    errors.push(`Invalid role. Allowed roles: ${allowedRoles.join(", ")}`);
  }

  // Client type validation (only required for client role)
  if (role === "client" && !req.body.client_type) {
    errors.push("Client type is required for client role");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { full_name, phone_number } = req.body;

  const errors = [];

  if (full_name && !full_name.trim()) {
    errors.push("Full name cannot be empty");
  }

  if (phone_number && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone_number)) {
    errors.push("Please provide a valid phone number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validatePasswordChange = (req, res, next) => {
  const { current_password, new_password, confirm_password } = req.body;

  const errors = [];

  if (!current_password) {
    errors.push("Current password is required");
  }

  if (!new_password) {
    errors.push("New password is required");
  } else if (new_password.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }

  if (!confirm_password) {
    errors.push("Confirm password is required");
  } else if (new_password !== confirm_password) {
    errors.push("New password and confirm password do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validatePasswordReset = (req, res, next) => {
  const { token, new_password, confirm_password } = req.body;

  const errors = [];

  if (!token) {
    errors.push("Reset token is required");
  }

  if (!new_password) {
    errors.push("New password is required");
  } else if (new_password.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }

  if (!confirm_password) {
    errors.push("Confirm password is required");
  } else if (new_password !== confirm_password) {
    errors.push("New password and confirm password do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }
  next();
};
