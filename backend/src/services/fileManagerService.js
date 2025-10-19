import {
  listObjectsInS3,
  getObjectMetadata,
  deleteObjectFromS3,
  deleteObjectsFromS3,
  createFolderInS3,
  generatePresignedDownloadUrl,
  s3Config,
} from "../config/aws.js";

export class FileManagerService {
  constructor() {
    this.bucketName = s3Config.bucketName;
  }

  async listFiles(params = {}) {
    try {
      const {
        prefix = "",
        maxKeys = 50,
        continuationToken,
        folder = "",
      } = params;

      const s3Params = {
        MaxKeys: parseInt(maxKeys),
      };

      if (prefix) {
        s3Params.Prefix = prefix;
      } else if (folder) {
        s3Params.Prefix = folder;
      }

      if (continuationToken) {
        s3Params.ContinuationToken = continuationToken;
      }

      const result = await listObjectsInS3(s3Params);

      if (!result.success) {
        throw new Error(result.error);
      }

      const data = result.data;

      // Process files
      const files = (data.Contents || [])
        .map((file) => {
          // Skip folder markers
          if (file.Key.endsWith("/")) return null;

          const fileName = file.Key.split("/").pop();
          return {
            key: file.Key,
            name: fileName,
            size: file.Size,
            lastModified: file.LastModified,
            type: this.getFileType(file.Key),
            url: `${s3Config.baseUrl}/${file.Key}`,
            folder: file.Key.split("/").slice(0, -1).join("/"),
            storageClass: file.StorageClass,
            etag: file.ETag,
          };
        })
        .filter((file) => file !== null);

      // Process folders
      const folders = (data.CommonPrefixes || []).map((prefix) => ({
        name: prefix.Prefix.split("/").filter(Boolean).pop(),
        prefix: prefix.Prefix,
        type: "folder",
      }));

      return {
        success: true,
        files,
        folders,
        isTruncated: data.IsTruncated,
        nextContinuationToken: data.NextContinuationToken,
        keyCount: data.KeyCount,
        totalObjects: data.KeyCount,
      };
    } catch (error) {
      console.error("FileManagerService - listFiles error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getFileDetails(key) {
    try {
      const decodedKey = decodeURIComponent(key);

      const metadataResult = await getObjectMetadata(decodedKey);
      if (!metadataResult.success) {
        throw new Error(metadataResult.error);
      }

      const url = await generatePresignedDownloadUrl(decodedKey, 3600);
      const metadata = metadataResult.data;

      const file = {
        key: decodedKey,
        name: decodedKey.split("/").pop(),
        size: metadata.ContentLength,
        lastModified: metadata.LastModified,
        contentType: metadata.ContentType,
        url: url,
        folder: decodedKey.split("/").slice(0, -1).join("/"),
        metadata: metadata.Metadata,
        storageClass: metadata.StorageClass,
        etag: metadata.ETag,
      };

      return {
        success: true,
        data: file,
      };
    } catch (error) {
      console.error("FileManagerService - getFileDetails error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteFile(key) {
    try {
      const result = await deleteObjectFromS3(key);
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      console.error("FileManagerService - deleteFile error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteFiles(keys) {
    try {
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        throw new Error("No files specified for deletion");
      }

      const result = await deleteObjectsFromS3(keys);
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        message: `Successfully deleted ${result.deleted.length} files`,
        data: {
          deleted: result.deleted,
          errors: result.errors,
        },
      };
    } catch (error) {
      console.error("FileManagerService - deleteFiles error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async createFolder(folderName, path = "") {
    try {
      if (!folderName || !folderName.trim()) {
        throw new Error("Folder name is required");
      }

      const folderPath = path
        ? `${path}/${folderName.trim()}`
        : folderName.trim();
      const result = await createFolderInS3(folderPath);

      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        message: "Folder created successfully",
        data: {
          name: folderName.trim(),
          key: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
          type: "folder",
        },
      };
    } catch (error) {
      console.error("FileManagerService - createFolder error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getStorageStats() {
    try {
      let totalSize = 0;
      let fileCount = 0;
      const filesByType = {};
      let continuationToken = null;

      do {
        const result = await listObjectsInS3({
          MaxKeys: 1000,
          ContinuationToken: continuationToken,
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        const data = result.data;

        data.Contents.forEach((file) => {
          // Skip folders
          if (!file.Key.endsWith("/")) {
            totalSize += file.Size;
            fileCount++;

            const extension = this.getFileType(file.Key);
            filesByType[extension] = (filesByType[extension] || 0) + 1;
          }
        });

        continuationToken = data.NextContinuationToken;
      } while (continuationToken);

      return {
        success: true,
        data: {
          totalSize,
          fileCount,
          filesByType,
          bucketName: this.bucketName,
        },
      };
    } catch (error) {
      console.error("FileManagerService - getStorageStats error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getFileType(filename) {
    const extension = filename.split(".").pop()?.toLowerCase();
    if (!extension) return "other";

    const typeMap = {
      // Images
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      webp: "image",
      svg: "image",
      bmp: "image",
      ico: "image",

      // Documents
      pdf: "document",
      doc: "document",
      docx: "document",
      txt: "document",
      xls: "document",
      xlsx: "document",
      ppt: "document",
      pptx: "document",

      // Videos
      mp4: "video",
      avi: "video",
      mov: "video",
      wmv: "video",
      flv: "video",
      mkv: "video",
      webm: "video",

      // Audio
      mp3: "audio",
      wav: "audio",
      ogg: "audio",
      aac: "audio",
      flac: "audio",
      m4a: "audio",

      // Archives
      zip: "archive",
      rar: "archive",
      "7z": "archive",
      tar: "archive",
      gz: "archive",
    };

    return typeMap[extension] || extension;
  }
}

export default new FileManagerService();
