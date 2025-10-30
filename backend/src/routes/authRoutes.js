import express from "express";
import {
  sendOtp,
  verifyOtpAndLogin,
  getCurrentUser,
  updateCurrentUser,
  logout,
  refreshToken,
} from "../controllers/authController.js";
import { validate } from "../middleware/validation.js";
import {
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from "../middleware/validation.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/send-otp", validate(sendOtpSchema), sendOtp);

router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpAndLogin);

router.post("/refresh-token", validate(refreshTokenSchema), refreshToken);

// Protected routes
router.get("/me", authenticateToken, getCurrentUser);

router.patch(
  "/profile",
  authenticateToken,
  validate(updateProfileSchema),
  updateCurrentUser
);

router.post("/logout", logout);

export default router;
