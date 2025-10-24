import api from "../services/base.api";

class UploadService {
  constructor() {
    this.baseUrl = "/upload"; // Adjust based on your backend route
  }

  // Generate presigned URL from backend
  async generatePresignedUrl(fileName, fileType, folder = "") {
    try {
      console.log("Generating presigned URL for:", {
        fileName,
        fileType,
        folder,
      });

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

  async uploadFile(file, folder = "", onProgress = null) {
    return new Promise(async (resolve, reject) => {
      try {
        debugger;
        console.log(
          "Starting upload for file:",
          file.name,
          file.type,
          file.size
        );

        // Get presigned URL from backend
        const presignedResult = await this.generatePresignedUrl(
          file.name,
          file.type,
          folder
        );

        console.log("Presigned result:", presignedResult);

        if (!presignedResult.success) {
          reject(
            new Error(`Failed to get presigned URL: ${presignedResult.error}`)
          );
          return;
        }

        const { presignedUrl, key, url } =
          presignedResult.data || presignedResult;

        // let fixedUrl = url;
        // if (folder && !url.includes(`${folder}/`)) {
        //   fixedUrl = url.replace(`${folder}`, `${folder}/`);
        //   console.log("Fixed URL from:", url, "to:", fixedUrl);
        // }
        // debugger;

        if (!presignedUrl) {
          reject(new Error("No presigned URL received from server"));
          return;
        }

        console.log("Uploading to presigned URL:", presignedUrl);

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (onProgress && event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          console.log(
            "Upload response status:",
            xhr.status,
            "Response:",
            xhr.responseText
          );

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
            reject(
              new Error(
                `Upload failed with status: ${xhr.status}. Response: ${
                  xhr.responseText || "No response"
                }`
              )
            );
          }
        });

        xhr.addEventListener("error", (e) => {
          console.error("XHR error:", e);
          reject(new Error("Upload failed due to network error"));
        });

        xhr.addEventListener("abort", () => {
          reject(new Error("Upload was cancelled"));
        });

        // Try different Content-Type approaches
        xhr.open("PUT", presignedUrl);

        // Option 1: Use binary content type (most reliable for S3)
        xhr.setRequestHeader("Content-Type", "application/octet-stream");

        // Option 2: Or use the actual file type (comment out above line and use this)
        // xhr.setRequestHeader("Content-Type", file.type);

        // Option 3: Or don't set Content-Type at all (let browser set it)
        // No Content-Type header

        xhr.send(file);
      } catch (error) {
        console.error("Upload service error:", error);
        reject(error);
      }
    });
  }

  // Upload multiple files with overall progress
  async uploadMultipleFiles(files, folder = "", onProgress = null) {
    const results = [];
    const totalFiles = files.length;
    let completedFiles = 0;
    debugger;
    for (let i = 0; i < totalFiles; i++) {
      const { file } = files[i];
      try {
        const result = await this.uploadFile(file, folder, (progress) => {
          if (onProgress) {
            // Calculate overall progress across all files
            const fileProgress = progress / totalFiles;
            const overallProgress =
              (completedFiles / totalFiles) * 100 + fileProgress;
            onProgress(Math.min(overallProgress, 100));
          }
        });

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

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
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

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
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

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error testing connection:", error);
      return { connected: false, error: error.message };
    }
  }
}

export default new UploadService();
