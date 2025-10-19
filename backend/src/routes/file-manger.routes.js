import express from "express";
import multer from "multer";
import FileManagerController from "../controllers/FileManagerController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer();
const fileManagerController = new FileManagerController();

// File operations
router.get("/files", protect, fileManagerController.listFiles);
router.get("/files/:key", protect, fileManagerController.getFileDetails);
router.post(
  "/files/upload",
  protect,
  upload.single("file"),
  fileManagerController.uploadFile
);
router.post(
  "/files/presigned-url",
  protect,
  fileManagerController.generatePresignedUrl
);
router.delete("/files/:key", protect, fileManagerController.deleteFile);
router.delete("/files", protect, fileManagerController.deleteFiles);

// Folder operations
router.post("/folders", protect, fileManagerController.createFolder);

// Storage operations
router.get("/storage/stats", protect, fileManagerController.getStorageStats);
router.get("/storage/test", protect, fileManagerController.testConnection);

export default router;
