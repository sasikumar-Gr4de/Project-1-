import express from "express";
import fileManagerController from "../controllers/fileManagerController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validation.js";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get files with pagination and filtering
router.get("/", fileManagerController.listFiles);

// Get file details
router.get("/:key", fileManagerController.getFileDetails);

// Delete single file
router.delete("/:key", fileManagerController.deleteFile);

// Delete multiple files
router.delete("/", fileManagerController.deleteFiles);

// Create folder
router.post("/folders", fileManagerController.createFolder);

// Get storage statistics
router.get("/stats/usage", fileManagerController.getStorageStats);

// Test S3 connection
router.get("/test/connection", fileManagerController.testConnection);

export default router;
