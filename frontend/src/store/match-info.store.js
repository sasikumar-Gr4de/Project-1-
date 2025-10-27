import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const useMatchInfoStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Create match info for a player
        createMatchInfo: async (matchInfoData) => {
          try {
            const response = await api.post("/match-info", matchInfoData);
            const result = response.data;
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        // Bulk create match info for multiple players
        createBulkMatchInfo: async (matchId, playersData) => {
          try {
            const response = await api.post("/match-info/bulk", {
              match_id: matchId,
              players: playersData,
            });
            const result = response.data;
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        // Get match info by match ID
        getMatchInfoByMatch: async (matchId) => {
          try {
            const response = await api.get(`/match-info/match/${matchId}`);
            const result = response.data;
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        // Update player end time
        updatePlayerEndTime: async (matchInfoId, endTime) => {
          try {
            const response = await api.patch(
              `/match-info/${matchInfoId}/end-time`,
              {
                end_time: endTime,
              }
            );
            const result = response.data;
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        // Delete match info
        deleteMatchInfo: async (matchInfoId) => {
          try {
            const response = await api.delete(`/match-info/${matchInfoId}`);
            const result = response.data;
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },
      }),
      {
        name: "match-info-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    )
  )
);
