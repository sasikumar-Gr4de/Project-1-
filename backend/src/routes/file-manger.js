import express from "express";
import multer from "multer";
import {
  listFilesController,
  getFileDetailsController,
  uploadFileController,
  deleteFileController,
  deleteFilesController,
  createFolderController,
  getStorageStatsController,
  testConnectionController,
  generatePresignedUrlController,
} from "../controllers/fileManagerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// File operations
router.get("/", listFilesController);
router.get("/stats", getStorageStatsController);
router.get("/test", testConnectionController);
router.get("/:key", getFileDetailsController);

// Upload operations
router.post("/upload", protect, upload.single("file"), uploadFileController);
router.post("/presigned-url", protect, generatePresignedUrlController);

// Delete operations
router.delete("/:key", protect, deleteFileController);
router.delete("/", protect, deleteFilesController);

// Folder operations
router.post("/folders", protect, createFolderController);

export default router;
