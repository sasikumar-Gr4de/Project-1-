import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { validate } from "../middleware/validation.js";
import { sendOtpSchema, verifyOtpSchema } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";
import { otpRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

// Public routes
router.post("/send-otp", otpRateLimit, validate(sendOtpSchema), sendOtp);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpAndLogin);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);
router.post("/logout", authenticateToken, logout);

export default router;
