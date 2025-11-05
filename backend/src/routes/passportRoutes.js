import express from "express";
import {
  getPlayerPassport,
  createPlayerIdentity,
  getVerificationStatus,
  uploadHeadshot,
  uploadVerificationDocument,
  ingestPlayerMetrics,
  getPlayerMetrics,
} from "../controllers/passportController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import {
  updateIdentitySchema,
  uploadHeadshotSchema,
  uploadVerificationSchema,
  ingestMetricsSchema,
} from "../middleware/validation.js";

const router = express.Router();

router.use(authenticateToken);

// Passport routes
router.get("/players/:player_id/passport", getPlayerPassport);

// Identity routes
router.post(
  "/players/:player_id/identity",
  validate(updateIdentitySchema),
  createPlayerIdentity
);
router.patch(
  "/players/:player_id/headshot",
  validate(uploadHeadshotSchema),
  uploadHeadshot
);

// Verification routes
router.get("/players/:player_id/verifications", getVerificationStatus);
router.post(
  "/players/:player_id/verifications",
  validate(uploadVerificationSchema),
  uploadVerificationDocument
);

// Metrics routes
router.post(
  "/players/:player_id/metrics",
  requireRole(["admin", "coach"]),
  validate(ingestMetricsSchema),
  ingestPlayerMetrics
);
router.get("/players/:player_id/metrics", getPlayerMetrics);

export default router;
