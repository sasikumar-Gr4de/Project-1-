import express from "express";
import AuthController from "../controllers/AuthController.js";
import { protect, optionalAuth } from "../middleware/auth.js";
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();

// login and registration routes
router.post("/register", validateRegistration, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.post("/refresh", protect, AuthController.refreshToken);
router.post("/logout", protect, AuthController.logout);

// profile routes
router.get("/profile", protect, AuthController.getProfile);
router.put(
  "/profile",
  protect,
  validateProfileUpdate,
  AuthController.updateProfile
);

// password management routes
router.post("/forgot-password", AuthController.requestPasswordReset);
router.post("/change-password", protect, AuthController.changePassword);
router.post("/reset-password", AuthController.resetPassword);

// email verification routes
router.post("/send-verification", AuthController.sendVerificationEmail);
router.get("/verify-status", protect, AuthController.checkVerificationStatus);

// account management routes
router.delete("/account", protect, AuthController.deleteAccount);

// session and permissions routes
router.get("/session", optionalAuth, AuthController.getSession);
router.get("/permissions", protect, AuthController.getPermissionsForRole);

// admin routes
router.get("/stats", protect, AuthController.getStats);

export default router;
