import express from "express";
import {
  getPlayerPassport,
  updatePlayerIdentity,
  ingestPlayerMetrics,
  getPlayerMetrics,
  getMetricsSummary,
  uploadVerificationDocument,
} from "../controllers/passportController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  updateIdentitySchema,
  ingestMetricsSchema,
  uploadVerificationSchema,
} from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get player passport (player can see own, admin/coach can see any)
router.get("/players/:player_id/passport", getPlayerPassport);

// Update player identity (player can update own, admin can update any)
router.patch(
  "/players/:player_id/identity",
  validate(updateIdentitySchema),
  updatePlayerIdentity
);

// Ingest metrics (admin/coach only)
router.post(
  "/players/:player_id/metrics",
  requireRole(["admin", "coach"]),
  validate(ingestMetricsSchema),
  ingestPlayerMetrics
);

// Get player metrics
router.get("/players/:player_id/metrics", getPlayerMetrics);

// Get metrics summary
router.get("/players/:player_id/metrics/summary", getMetricsSummary);

// Upload verification document (player can upload own)
router.post(
  "/players/:player_id/verifications",
  validate(uploadVerificationSchema),
  uploadVerificationDocument
);

export default router;
