import express from "express";
import {
  getQueue,
  updateScoringWeights,
  getSystemMetrics,
} from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole([USER_ROLES.ADMIN]));

router.get("/queue", getQueue);
router.get("/metrics", getSystemMetrics);
router.patch("/scoring-weights", updateScoringWeights);

export default router;
