import { create } from "zustand";
import api from "@/services/base.api.js";

const playerDataAPI = {
  uploadPlayerData: (data) => api.post("/data", data),
  changePlayerDataStatus: (dataId, status) =>
    api.post(`/data/${dataId}`, { status }),
};

export const useDataStore = create((set, get) => ({
  // Actions
  uploadPlayerData: async (data) => {
    try {
      const response = await playerDataAPI.uploadPlayerData(data);
      if (response.data.success) {
        set({ isLoading: false });
        return response.data;
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
