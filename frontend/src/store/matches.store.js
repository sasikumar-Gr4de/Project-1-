import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const useMatchesStore = create(
  devtools(
    persist(
      (set, get) => ({
        getAllMatches: async (page = 1, pageSize = 10, filters = {}) => {
          try {
            const response = await api.get("/matches", {
              params: {
                page,
                pageSize,
                ...filters,
              },
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
        createMatch: async (matchData) => {
          try {
            const response = await api.post("/matches", matchData);
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
        updateMatch: async (id, updatedData) => {
          try {
            const response = await api.put(`/matches/${id}`, updatedData);
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
        deleteMatch: async (id) => {
          try {
            const response = await api.delete(`/matches/${id}`);
            const { data } = response;
            return data;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },
        getMatchById: async (id) => {
          try {
            const response = await api.get(`/matches/${id}`);
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
        name: "matches-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    )
  )
);
