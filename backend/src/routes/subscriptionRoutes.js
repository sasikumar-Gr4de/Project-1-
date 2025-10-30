import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
  getSubscription,
  createPortalSession,
  getPlans,
  checkAccess,
  syncSubscription,
} from "../controllers/subscriptionController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Webhook needs to be public (no auth) - must be raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// Protected routes
router.use(authenticateToken);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/create-portal-session", createPortalSession);
router.post("/check-access", checkAccess);
router.post("/sync", syncSubscription);
router.get("/current", getSubscription);
router.get("/plans", getPlans);

export default router;
