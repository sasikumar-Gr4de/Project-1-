import express from "express";
import {
  generateReport,
  getReportPdf,
} from "../controllers/reportController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(authenticateToken);

// Generate report (admin only for now)
router.post("/generate", requireRole([USER_ROLES.ADMIN]), generateReport);
router.get("/:reportId/pdf", getReportPdf);

export default router;
