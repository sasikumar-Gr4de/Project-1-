import express from "express";
import UserController from "../controllers/UsersController.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes - Admin only
router.post("/", protect, adminOnly, UserController.createUser);
router.get("/", protect, adminOnly, UserController.getAllUsers);
router.get("/role/:role", protect, adminOnly, UserController.getUsersByRole);
router.get("/:id", protect, adminOnly, UserController.getUserById);
router.put("/:id", protect, adminOnly, UserController.updateUser);
router.delete("/:id", protect, adminOnly, UserController.deleteUser);
router.patch("/:id/activate", protect, adminOnly, UserController.activateUser);
router.patch(
  "/:id/deactivate",
  protect,
  adminOnly,
  UserController.deactivateUser
);
router.get("/:id/reference-data", protect, UserController.getUserReferenceData);

export default router;
