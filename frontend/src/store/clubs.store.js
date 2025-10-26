import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const useClubsStore = create(
  devtools(
    persist(
      (set, get) => ({
        getAllClubs: async (page = 1, pageSize = 10, filters = {}) => {
          try {
            const response = await api.get("/clubs", {
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
        getClubById: async (id) => {
          try {
            const response = await api.get(`/clubs/${id}`);
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
        getAllClubsForSelect: async () => {
          try {
            const response = await api.get("/clubs", {
              params: {
                page: 0,
                pageSize: 0,
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

        createClub: async (clubData) => {
          try {
            const response = await api.post("/clubs", clubData);
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
        updateClub: async (id, updatedData) => {
          try {
            const response = await api.put(`/clubs/${id}`, updatedData);
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
        deleteClub: async (id) => {
          try {
            const response = await api.delete(`/clubs/${id}`);
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
        name: "clubs-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    )
  )
);
