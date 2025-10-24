import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const usePlayersStore = create(
  devtools(
    persist(
      (set, get) => ({
        getAllPlayers: async (page = 1, pageSize = 10, filters = {}) => {
          try {
            const response = await api.get("/players", {
              params: {
                page,
                pageSize,
                ...filters,
              },
            });
            const result = response.data;
            console.log(result);
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },
        createPlayer: async (playerData) => {
          try {
            const response = await api.post("/players", playerData);
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
        updatePlayer: async (id, updatedData) => {
          try {
            const response = await api.put(`/players/${id}`, updatedData);
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
        deletePlayer: async (id) => {
          try {
            const response = await api.delete(`/players/${id}`);
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
      }),
      {
        name: "players-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    )
  )
);
