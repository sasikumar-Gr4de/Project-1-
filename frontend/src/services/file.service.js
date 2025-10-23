// services/file.service.js
import awsService from "@/services/aws.service.js";

export const fileService = {
  // Upload file directly to S3 with progress tracking
  async uploadFileDirect(file, folder = "", onProgress = null) {
    try {
      // Validate file type and size
      const validationResult = this.validateFile(file);
      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.error,
        };
      }

      const key = `${folder}${this.generateFileName(file)}`;

      // Use AWS SDK's upload with progress tracking
      const result = await awsService.uploadFileWithProgress(
        file,
        key,
        onProgress
      );

      return {
        success: true,
        url: result.url,
        key: result.key,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };
    } catch (error) {
      console.error("File upload error:", error);
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }
  },

  // Generate unique file name
  generateFileName(file) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const baseName = file.name.substring(0, file.name.lastIndexOf("."));

    return `${baseName}-${timestamp}-${randomString}.${fileExtension}`;
  },

  // Validate file
  validateFile(file, maxSize = 10 * 1024 * 1024) {
    // Check if file exists
    if (!file) {
      return { valid: false, error: "No file provided" };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${maxSize / 1024 / 1024}MB limit`,
      };
    }

    // Check file type (basic validation)
    if (file.type && file.type.startsWith("text/")) {
      // Additional text file validation if needed
    }

    return { valid: true };
  },

  // Multiple file upload
  async uploadMultipleFiles(files, folder = "", onProgress = null) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadFileDirect(file, folder, (progress) => {
        if (onProgress) {
          // Calculate overall progress across all files
          const individualProgress = progress / files.length;
          const previousProgress = (i / files.length) * 100;
          const totalProgress = previousProgress + individualProgress;
          onProgress(totalProgress);
        }
      });
      results.push(result);
    }

    return results;
  },

  // Delete file
  async deleteFile(key) {
    return await awsService.deleteFile(key);
  },

  // Get file URL
  getFileUrl(key) {
    return awsService.getFileUrl(key);
  },
};

export default fileService;
