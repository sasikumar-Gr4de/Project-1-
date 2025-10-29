import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
  getSubscription,
} from "../controllers/subscriptionController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Webhook needs to be public (no auth)
router.post("/webhook", handleWebhook);

// Protected routes
router.use(authenticateToken);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/current", getSubscription);

export default router;
