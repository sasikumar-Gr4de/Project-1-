import express from "express";
import { setupS3ForPublicAccess } from "../config/aws.config.js";

const router = express.Router();

router.post("/setup-bucket-permissions", async (req, res) => {
  try {
    console.log("Starting complete S3 bucket setup...");

    const result = await setupS3ForPublicAccess();

    if (result.success) {
      res.json({
        success: true,
        message: "S3 bucket fully configured for public access",
        details: result,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in setup endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
