import {
  listS3Objects,
  getS3ObjectMetadata,
  deleteFromS3,
  deleteMultipleFromS3,
  createS3Folder,
  generatePresignedDownloadUrl,
  generatePresignedUploadUrl,
  uploadToS3,
  s3Config,
} from "../config/aws.js";

import { fileTypeMap } from "../utils/constants.js";

// Helper function to get file type
const getFileType = (filename) => {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!extension) return "other";
  return fileTypeMap[extension] || extension;
};

// File listing with folder support
export const listFiles = async (params = {}) => {
  try {
    const {
      prefix = "",
      maxKeys = 50,
      continuationToken,
      folder = "",
    } = params;

    const s3Params = {
      MaxKeys: parseInt(maxKeys),
      Delimiter: "/",
    };

    // Build prefix for folder navigation
    if (prefix) {
      s3Params.Prefix = prefix;
    } else if (folder) {
      s3Params.Prefix = folder.endsWith("/") ? folder : `${folder}/`;
    }

    if (continuationToken) {
      s3Params.ContinuationToken = continuationToken;
    }

    const result = await listS3Objects(s3Params);
    if (!result.success) {
      throw new Error(result.error);
    }

    const data = result.data;

    // Process files (non-folder objects)
    const files = (data.Contents || [])
      .map((file) => {
        // Skip folder markers and empty objects
        if (file.Key.endsWith("/") || file.Size === 0) return null;

        const fileName = file.Key.split("/").pop();
        return {
          key: file.Key,
          name: fileName,
          size: file.Size,
          lastModified: file.LastModified,
          type: getFileType(file.Key),
          url: `${s3Config.baseUrl}/${file.Key}`,
          folder: file.Key.split("/").slice(0, -1).join("/"),
          storageClass: file.StorageClass,
          etag: file.ETag,
        };
      })
      .filter((file) => file !== null);

    // Process folders from CommonPrefixes
    const folders = (data.CommonPrefixes || []).map((prefix) => ({
      name: prefix.Prefix.split("/").filter(Boolean).pop(),
      prefix: prefix.Prefix,
      type: "folder",
      url: `${s3Config.baseUrl}/${prefix.Prefix}`,
    }));

    return {
      success: true,
      files,
      folders,
      isTruncated: data.IsTruncated,
      nextContinuationToken: data.NextContinuationToken,
      keyCount: data.KeyCount,
    };
  } catch (error) {
    console.error("FileManagerService - listFiles error:", error);
    return { success: false, error: error.message };
  }
};

// Direct file upload
export const uploadFile = async (fileBuffer, key, contentType) => {
  try {
    const result = await uploadToS3(key, fileBuffer, contentType);
    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      message: "File uploaded successfully",
      data: {
        key,
        url: `${s3Config.baseUrl}/${key}`,
        contentType,
      },
    };
  } catch (error) {
    console.error("FileManagerService - uploadFile error:", error);
    return { success: false, error: error.message };
  }
};

// Get presigned URL for client-side upload
export const getPresignedUploadUrl = async (
  key,
  contentType,
  expiresIn = 3600
) => {
  try {
    const signedUrl = await generatePresignedUploadUrl(
      key,
      contentType,
      expiresIn
    );

    return {
      success: true,
      data: {
        signedUrl,
        key,
        contentType,
        expiresIn,
        url: `${s3Config.baseUrl}/${key}`,
      },
    };
  } catch (error) {
    console.error(
      "FileManagerService - generatePresignedUploadUrl error:",
      error
    );
    return { success: false, error: error.message };
  }
};

// Get file details with signed URL
export const getFileDetails = async (key) => {
  try {
    const decodedKey = decodeURIComponent(key);

    const metadataResult = await getS3ObjectMetadata(decodedKey);
    if (!metadataResult.success) {
      throw new Error(metadataResult.error);
    }

    const downloadUrl = await generatePresignedDownloadUrl(decodedKey, 3600);
    const metadata = metadataResult.data;

    const file = {
      key: decodedKey,
      name: decodedKey.split("/").pop(),
      size: metadata.ContentLength,
      lastModified: metadata.LastModified,
      contentType: metadata.ContentType,
      url: downloadUrl,
      publicUrl: `${s3Config.baseUrl}/${decodedKey}`,
      folder: decodedKey.split("/").slice(0, -1).join("/"),
      metadata: metadata.Metadata,
      storageClass: metadata.StorageClass,
      etag: metadata.ETag,
    };

    return { success: true, data: file };
  } catch (error) {
    console.error("FileManagerService - getFileDetails error:", error);
    return { success: false, error: error.message };
  }
};

// Delete single file
export const deleteFile = async (key) => {
  try {
    const result = await deleteFromS3(key);
    if (!result.success) {
      throw new Error(result.error);
    }

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("FileManagerService - deleteFile error:", error);
    return { success: false, error: error.message };
  }
};

// Delete multiple files
export const deleteFiles = async (keys) => {
  try {
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      throw new Error("No files specified for deletion");
    }

    const result = await deleteMultipleFromS3(keys);
    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      success: true,
      message: `Successfully deleted ${result.deleted.length} files`,
      data: { deleted: result.deleted, errors: result.errors },
    };
  } catch (error) {
    console.error("FileManagerService - deleteFiles error:", error);
    return { success: false, error: error.message };
  }
};

// Create folder
export const createFolder = async (folderName, path = "") => {
  try {
    if (!folderName?.trim()) {
      throw new Error("Folder name is required");
    }

    const folderPath = path
      ? `${path}/${folderName.trim()}`
      : folderName.trim();
    const result = await createS3Folder(folderPath);

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
        url: `${s3Config.baseUrl}/${folderPath}`,
      },
    };
  } catch (error) {
    console.error("FileManagerService - createFolder error:", error);
    return { success: false, error: error.message };
  }
};

// Get storage statistics
export const getStorageStats = async () => {
  try {
    let totalSize = 0;
    let fileCount = 0;
    const filesByType = {};
    let continuationToken = null;

    do {
      const result = await listS3Objects({
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
          const extension = getFileType(file.Key);
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
        bucketName: s3Config.bucketName,
      },
    };
  } catch (error) {
    console.error("FileManagerService - getStorageStats error:", error);
    return { success: false, error: error.message };
  }
};

// Test S3 connection
export const testConnection = async () => {
  try {
    const stats = await getStorageStats();
    return {
      success: stats.success,
      message: stats.success
        ? "S3 connection successful"
        : "S3 connection failed",
      data: stats.data,
    };
  } catch (error) {
    console.error("FileManagerService - testConnection error:", error);
    return { success: false, error: "S3 connection test failed" };
  }
};
