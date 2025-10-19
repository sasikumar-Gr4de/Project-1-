import fileManagerService from "../services/fileManagerService.js";

export class FileManagerController {
  async listFiles(req, res) {
    try {
      const {
        prefix = "",
        maxKeys = 50,
        continuationToken,
        folder = "",
      } = req.query;

      const result = await fileManagerService.listFiles({
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

      const result = await fileManagerService.getFileDetails(key);

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

  async deleteFile(req, res) {
    try {
      const { key } = req.params;

      if (!key) {
        return res.status(400).json({
          success: false,
          error: "File key is required",
        });
      }

      const result = await fileManagerService.deleteFile(key);

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

      const result = await fileManagerService.deleteFiles(keys);

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

      const result = await fileManagerService.createFolder(folderName, path);

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
      const result = await fileManagerService.getStorageStats();

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
      const result = await fileManagerService.getStorageStats();

      res.json({
        success: result.success,
        message: result.success
          ? "S3 connection successful"
          : "S3 connection failed",
        data: result.data,
      });
    } catch (error) {
      console.error("FileManagerController - testConnection error:", error);
      res.status(500).json({
        success: false,
        error: "S3 connection test failed",
      });
    }
  }
}

export default new FileManagerController();
