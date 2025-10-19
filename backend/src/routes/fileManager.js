import express from "express";
import {
  listFiles,
  getFileDetails,
  deleteFile,
  deleteFiles,
  createFolder,
  getStorageStats,
  uploadFile,
  testConnection,
} from "../controllers/fileManagerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/file-manager/
 * @desc    List files and folders
 * @access  Private
 */
router.get("/", protect, listFiles);

/**
 * @route   POST /api/file-manager/upload
 * @desc    Upload a file
 * @access  Private
 */
router.post("/upload", protect, uploadFile);

/**
 * @route   GET /api/file-manager/:key
 * @desc    Get file details by key
 * @access  Private
 */
router.get("/:key", protect, getFileDetails);

/**
 * @route   DELETE /api/file-manager/:key
 * @desc    Delete a file by key
 * @access  Private
 */
router.delete("/:key", protect, deleteFile);

/**
 * @route   DELETE /api/file-manager/
 * @desc    Delete multiple files
 * @access  Private
 */
router.delete("/", protect, deleteFiles);

/**
 * @route   POST /api/file-manager/folders
 * @desc    Create a new folder
 * @access  Private
 */
router.post("/folders", protect, createFolder);

/**
 * @route   GET /api/file-manager/stats/usage
 * @desc    Get storage usage statistics
 * @access  Private
 */
router.get("/stats/usage", protect, getStorageStats);

/**
 * @route   GET /api/file-manager/test/connection
 * @desc    Test connection to the storage service
 * @access  Private
 */
router.get("/test/connection", protect, testConnection);

export default router;
