import express from "express";
import {
  getDashboard,
  getReports,
  getReport,
  updateProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { updateProfileSchema } from "../middleware/validation.js";

const router = express.Router();

router.use(authenticateToken);

// Protected routes
router.get("/dashboard", getDashboard);
router.get("/reports", getReports);
router.get("/reports/:reportId", getReport);

// Update Profile
router.patch("/profile", validate(updateProfileSchema), updateProfile);

export default router;
