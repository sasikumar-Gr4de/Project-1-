import FileManagerService from "../services/fileManagerService.js";

class FileManagerController {
  constructor() {
    this.fileManagerService = new FileManagerService();
    this.listFiles = this.listFiles.bind(this);
    this.getFileDetails = this.getFileDetails.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.generatePresignedUrl = this.generatePresignedUrl.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteFiles = this.deleteFiles.bind(this);
    this.createFolder = this.createFolder.bind(this);
    this.getStorageStats = this.getStorageStats.bind(this);
    this.testConnection = this.testConnection.bind(this);
  }

  async listFiles(req, res) {
    try {
      const {
        prefix = "",
        maxKeys = 50,
        continuationToken,
        folder = "",
      } = req.query;

      const result = await this.fileManagerService.listFiles({
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
  }

  async getFileDetails(req, res) {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "File key is required",
        });
      }

      const result = await this.fileManagerService.getFileDetails(key);

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
  }

  async uploadFile(req, res) {
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

      const result = await this.fileManagerService.uploadFile(
        file.buffer,
        fileKey,
        file.mimetype
      );

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
  }

  async generatePresignedUrl(req, res) {
    try {
      const { key, contentType, expiresIn = 3600 } = req.body;

      if (!key || !contentType) {
        return res.status(400).json({
          success: false,
          error: "Key and content type are required",
        });
      }

      const result = await this.fileManagerService.getPresignedUploadUrl(
        key,
        contentType,
        expiresIn
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error(
        "FileManagerController - generatePresignedUrl error:",
        error
      );
      res.status(500).json({
        success: false,
        error: "Failed to generate upload URL",
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "File key is required",
        });
      }

      const result = await this.fileManagerService.deleteFile(key);

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
  }

  async deleteFiles(req, res) {
    try {
      const { keys } = req.body;

      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files specified for deletion",
        });
      }

      const result = await this.fileManagerService.deleteFiles(keys);

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
  }

  async createFolder(req, res) {
    try {
      const { folderName, path = "" } = req.body;

      if (!folderName) {
        return res.status(400).json({
          success: false,
          error: "Folder name is required",
        });
      }

      const result = await this.fileManagerService.createFolder(
        folderName,
        path
      );

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
  }

  async getStorageStats(req, res) {
    try {
      const result = await this.fileManagerService.getStorageStats();

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
  }

  async testConnection(req, res) {
    try {
      const result = await this.fileManagerService.testConnection();

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
  }
}

export default FileManagerController;
