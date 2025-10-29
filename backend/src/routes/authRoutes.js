import express from "express";
import { authController } from "../controllers/index.js";
import { validate } from "../middleware/validation.js";
import { sendOtpSchema, verifyOtpSchema } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";
import { otpRateLimit } from "../middleware/rateLimit.js";

const router = express.Router();

// Public routes
router.post(
  "/send-otp",
  otpRateLimit,
  validate(sendOtpSchema),
  authController.sendOtp
);
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyOtpAndLogin
);

// Protected routes
router.get("/me", authenticateToken, authController.getCurrentUser);
router.post("/logout", authenticateToken, authController.logout);

export default router;
