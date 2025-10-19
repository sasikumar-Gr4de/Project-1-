import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  changePassword,
  deleteAccount,
  sendVerificationEmail,
  checkVerificationStatus,
  getPermissionsForRole,
  getStats,
  getSession,
} from "../controllers/authController.js";

import { protect, optionalAuth } from "../middleware/auth.js";
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();

// login and registration routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);
router.post("/refresh", protect, refreshToken);
router.post("/logout", protect, logout);

// profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validateProfileUpdate, updateProfile);

// password management routes
router.post("/change-password", protect, changePassword);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// email verification routes
router.post("/resend-verification", protect, sendVerificationEmail);
router.get("/verification-status", protect, checkVerificationStatus);

// account management routes
router.delete("/account", protect, deleteAccount);
router.get("/session", optionalAuth, getSession);
router.get("/permissions", protect, getPermissionsForRole);
router.get("/stats", protect, getStats);

export default router;
