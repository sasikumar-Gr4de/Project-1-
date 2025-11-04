import express from "express";
import {
  getPendingVerifications,
  reviewVerification,
  getVerificationStats,
} from "../controllers/verificationController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { reviewVerificationSchema } from "../middleware/validation.js";

const router = express.Router();

// Admin only routes
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// Get pending verifications
router.get("/pending", getPendingVerifications);

// Review verification
router.post(
  "/:verification_id/review",
  validate(reviewVerificationSchema),
  reviewVerification
);

// Get verification stats
router.get("/stats", getVerificationStats);

export default router;
