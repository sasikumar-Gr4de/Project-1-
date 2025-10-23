import api from "../services/base.api";

class UploadService {
  constructor() {
    this.baseUrl = "/upload"; // Adjust based on your backend route
  }

  // Generate presigned URL from backend
  async generatePresignedUrl(fileName, fileType, folder = "") {
    try {
      debugger;
      const response = await api.post(
        `${this.baseUrl}/generate-presigned-url`,
        {
          fileName,
          fileType,
          folder,
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      return {
        success: false,
        error: error.message || "Failed to generate upload URL",
      };
    }
  }

  // Upload file using presigned URL with progress tracking
  async uploadFileWithProgress(file, folder = "", onProgress = null) {
    return new Promise(async (resolve, reject) => {
      try {
        // Get presigned URL from backend
        const presignedResult = await this.generatePresignedUrl(
          file.name,
          file.type,
          folder
        );

        if (!presignedResult.success) {
          reject(new Error(presignedResult.error));
          return;
        }

        const { presignedUrl, key, url } = presignedResult;

        // Upload using XMLHttpRequest for progress tracking
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (onProgress && event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            resolve({
              success: true,
              url: url,
              key: key,
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
            });
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed due to network error"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload was cancelled"));
        });

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Upload multiple files with overall progress
  async uploadMultipleFiles(files, folder = "", onProgress = null) {
    const results = [];
    const totalFiles = files.length;
    let completedFiles = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const result = await this.uploadFileWithProgress(
          file,
          folder,
          (progress) => {
            if (onProgress) {
              // Calculate overall progress across all files
              const fileProgress = progress / totalFiles;
              const overallProgress =
                (completedFiles / totalFiles) * 100 + fileProgress;
              onProgress(Math.min(overallProgress, 100));
            }
          }
        );

        results.push(result);
        completedFiles++;
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          fileName: file.name,
        });
        completedFiles++;
      }
    }

    return results;
  }

  // Delete file from S3
  async deleteFile(key) {
    try {
      const response = await api.delete(
        `${this.baseUrl}/file/${encodeURIComponent(key)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error: error.message };
    }
  }

  // List files in a folder
  async listFiles(prefix = "") {
    try {
      const response = await api.get(
        `${this.baseUrl}/files?prefix=${encodeURIComponent(prefix)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error listing files:", error);
      return { success: false, error: error.message };
    }
  }

  // Test connection to backend and S3
  async testConnection() {
    try {
      const response = await api.get(`${this.baseUrl}/test-connection`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error testing connection:", error);
      return { connected: false, error: error.message };
    }
  }
}

export default new UploadService();
