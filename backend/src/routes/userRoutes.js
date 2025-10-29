import express from "express";
import { userController } from "../controllers";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validation.js";
import { updateProfileSchema } from "../middleware/validation.js";

const router = express.Router();

router.use(authenticateToken);

// Protected routes
router.get("/dashboard", userController.getDashboard);
router.get("/reports", userController.getReports);
router.get("/reports/:reportId", userController.getReport);

router.patch(
  "/profile",
  validate(updateProfileSchema),
  userController.updateProfile
);

export default router;
