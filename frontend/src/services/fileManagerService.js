import api from "./api";

export const fileManagerService = {
  // Get files with pagination and filtering
  getFiles: async (params = {}) => {
    const response = await api.get("/file-manager", { params });
    return response.data;
  },

  // Get file details
  getFileDetails: async (key) => {
    const response = await api.get(`/file-manager/${encodeURIComponent(key)}`);
    return response.data;
  },

  // Delete single file
  deleteFile: async (key) => {
    const response = await api.delete(
      `/file-manager/${encodeURIComponent(key)}`
    );
    return response.data;
  },

  // Delete multiple files
  deleteFiles: async (keys) => {
    const response = await api.delete("/file-manager", {
      data: { keys },
    });
    return response.data;
  },

  // Create folder
  createFolder: async (folderName, path = "") => {
    const response = await api.post("/file-manager/folders", {
      folderName,
      path,
    });
    return response.data;
  },

  // Get storage statistics
  getStorageStats: async () => {
    const response = await api.get("/file-manager/stats/usage");
    return response.data;
  },

  // Test connection
  testConnection: async () => {
    const response = await api.get("/file-manager/test/connection");
    return response.data;
  },
};
