import { create } from "zustand";
import api from "@/services/base.api.js";

const playerDataAPI = {
  uploadPlayerData: (data) => api.post("/data", data),
};

export const useDataStore = create((set, get) => ({
  uploadPlayerData: async (data) => {
    try {
      const response = await playerDataAPI.uploadPlayerData(data);
      if (response.data.success) {
        set({ isLoading: false });
        console.log("Upload response data:", response.data);
        return response;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload player data",
        isLoading: false,
      });
      throw error;
    }
  },
}));
