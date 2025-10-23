import express from "express";
import {
  generatePresignedUploadUrl,
  deleteFromS3,
  listS3Objects,
  s3Config,
} from "../config/aws.config.js";

const router = express.Router();

// Generate presigned URL for file upload
router.post("/generate-presigned-url", async (req, res) => {
  try {
    const { fileName, fileType, folder = "" } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        error: "fileName and fileType are required",
      });
    }

    // Clean filename and create key
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const key = folder
      ? `${folder}${cleanFileName}-${timestamp}-${randomString}`
      : `${cleanFileName}-${timestamp}-${randomString}`;

    // Generate presigned URL
    const presignedUrl = await generatePresignedUploadUrl(key, fileType, 3600);

    const fileUrl = `${s3Config.baseUrl}/${key}`;

    res.json({
      success: true,
      presignedUrl,
      key,
      url: fileUrl,
      fileName: cleanFileName,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete file from S3
router.delete("/file/:key", async (req, res) => {
  try {
    const { key } = req.params;

    const result = await deleteFromS3(key);

    if (result.success) {
      res.json({ success: true, message: "File deleted successfully" });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// List files in a folder
router.get("/files", async (req, res) => {
  try {
    const { prefix = "", maxKeys = 100 } = req.query;

    const result = await listS3Objects({
      Prefix: prefix,
      MaxKeys: parseInt(maxKeys),
    });

    if (result.success) {
      const files = (result.data.Contents || []).map((item) => ({
        key: item.Key,
        name: item.Key.split("/").pop(),
        size: item.Size,
        lastModified: item.LastModified,
        url: `${s3Config.baseUrl}/${item.Key}`,
      }));

      res.json({ success: true, files });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test S3 connection
router.get("/test-connection", async (req, res) => {
  try {
    const result = await testS3Connection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

export default router;
