import express from "express";
import {
  retryJob,
  getProcessingQueue,
  getSystemMetrics,
  deleteJob,
  getUsers,
  updateUserStatus,
  getReports,
  deleteReport,
  regenerateReport,
  getSystemAnalytics,
} from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

// All admin routes require admin role
router.use(authenticateToken);
router.use(requireRole([USER_ROLES.ADMIN]));

// System Metrics
router.get("/metrics", getSystemMetrics);

// Queue Management
router.get("/queue", getProcessingQueue);
router.post("/queue/:jobId/retry", retryJob);
router.delete("/queue/:jobId", deleteJob);

// User Management
router.get("/users", getUsers);
router.patch("/users/:userId/status", updateUserStatus);

// Report Management
router.get("/reports", getReports);
router.delete("/reports/:reportId", deleteReport);
router.post("/reports/:reportId/regenerate", regenerateReport);

// System Analytics
router.get("/analytics", getSystemAnalytics);

export default router;
