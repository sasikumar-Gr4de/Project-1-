import express from "express";
import AuthController from "../controllers/AuthController";
import { protect, optionalAuth } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", protect, AuthController.getProfile);
router.put("/profile", protect, AuthController.updateProfile);

router.post("/change-password", protect, AuthController.changePassword);

router.post("/verify-resend", protect, AuthController.sendVerificationEmail);
router.get("/verify-status", protect, AuthController.checkVerificationStatus);

export default router;
