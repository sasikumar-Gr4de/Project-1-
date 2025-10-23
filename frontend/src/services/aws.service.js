// services/aws-fixed.service.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const bucketName = import.meta.env.VITE_AWS_S3_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;

// Create S3 client with minimal configuration
const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const awsService = {
  // Simple upload without progress tracking
  async uploadFile(file, folder = "") {
    try {
      // Clean filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const key = folder
        ? `${folder}${Date.now()}-${cleanFileName}`
        : `${Date.now()}-${cleanFileName}`;

      console.log("Uploading file:", { key, bucket: bucketName });

      // Use a try-catch to handle the stream error gracefully
      try {
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: file,
          ContentType: file.type,
          ACL: "public-read",
        });

        await s3Client.send(command);

        const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

        return {
          success: true,
          url: fileUrl,
          key: key,
          fileName: file.name,
          message: "File uploaded successfully",
        };
      } catch (streamError) {
        // If stream error occurs, fall back to fetch API
        console.log("Stream error, falling back to fetch API");
        return await this.uploadWithFetch(file, key);
      }
    } catch (error) {
      console.error("AWS Upload Error:", error);
      return {
        success: false,
        error: error.message,
        code: error.name,
      };
    }
  },

  // Fallback method using Fetch API
  async uploadWithFetch(file, key) {
    try {
      // This would require a backend to generate presigned URLs
      // For now, we'll throw an error suggesting the backend approach
      throw new Error(
        "Stream upload failed. Please implement backend presigned URL endpoint."
      );
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Simulated progress upload for better UX
  async uploadFileWithProgress(file, folder = "", onProgress = null) {
    return new Promise(async (resolve, reject) => {
      try {
        // Start with immediate progress to show something is happening
        if (onProgress) onProgress(10);

        // Simulate progress
        const simulateProgress = () => {
          let progress = 10;
          const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 90) {
              clearInterval(interval);
              if (onProgress) onProgress(90);
            } else {
              if (onProgress) onProgress(progress);
            }
          }, 200);
          return interval;
        };

        const progressInterval = simulateProgress();

        // Perform actual upload
        const result = await this.uploadFile(file, folder);

        clearInterval(progressInterval);

        if (result.success) {
          if (onProgress) onProgress(100);
          resolve(result);
        } else {
          reject(new Error(result.error));
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default awsService;
