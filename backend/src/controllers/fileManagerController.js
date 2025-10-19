import {
  listFiles,
  getFileDetails,
  uploadFile,
  deleteFile,
  deleteFiles,
  createFolder,
  getStorageStats,
  testConnection,
  getPresignedUploadUrl,
} from "../services/fileManagerService.js";

export const listFilesController = async (req, res) => {
  try {
    const {
      prefix = "",
      maxKeys = 50,
      continuationToken,
      folder = "",
    } = req.query;

    const result = await listFiles({
      prefix,
      maxKeys: parseInt(maxKeys),
      continuationToken,
      folder,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - listFiles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch files",
    });
  }
};

export const getFileDetailsController = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "File key is required",
      });
    }

    const result = await getFileDetails(key);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - getFileDetails error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch file details",
    });
  }
};

export const uploadFileController = async (req, res) => {
  try {
    const file = req.file;
    const { path = "", key } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Generate key if not provided
    const fileKey =
      key || `${path ? path + "/" : ""}${Date.now()}-${file.originalname}`;

    const result = await uploadFile(file.buffer, fileKey, file.mimetype);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - uploadFile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload file",
    });
  }
};

// Generate presigned URL for client-side upload
export const generatePresignedUrlController = async (req, res) => {
  try {
    const { key, contentType, expiresIn = 3600 } = req.body;

    if (!key || !contentType) {
      return res.status(400).json({
        success: false,
        error: "Key and content type are required",
      });
    }

    const result = await getPresignedUploadUrl(key, contentType, expiresIn);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - generatePresignedUrl error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate upload URL",
    });
  }
};

// Delete single file
export const deleteFileController = async (req, res) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "File key is required",
      });
    }

    const result = await deleteFile(key);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - deleteFile error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete file",
    });
  }
};

// Delete multiple files
export const deleteFilesController = async (req, res) => {
  try {
    const { keys } = req.body;

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files specified for deletion",
      });
    }

    const result = await deleteFiles(keys);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - deleteFiles error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete files",
    });
  }
};

export const createFolderController = async (req, res) => {
  try {
    const { folderName, path = "" } = req.body;

    if (!folderName) {
      return res.status(400).json({
        success: false,
        error: "Folder name is required",
      });
    }

    const result = await createFolder(folderName, path);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - createFolder error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create folder",
    });
  }
};

export const getStorageStatsController = async (req, res) => {
  try {
    const result = await getStorageStats();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - getStorageStats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch storage statistics",
    });
  }
};

export const testConnectionController = async (req, res) => {
  try {
    const result = await testConnection();

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error("FileManagerController - testConnection error:", error);
    res.status(500).json({
      success: false,
      error: "S3 connection test failed",
    });
  }
};
