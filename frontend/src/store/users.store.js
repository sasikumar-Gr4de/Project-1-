import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const useUsersStore = create(
  devtools(
    persist(
      (set, get) => ({
        getAllUsers: async (page = 1, pageSize = 10, filters = {}) => {
          try {
            const response = await api.get("/users", {
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

        getUserById: async (id) => {
          try {
            const response = await api.get(`/users/${id}`);
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

        updateUser: async (id, updatedData) => {
          try {
            const response = await api.put(`/users/${id}`, updatedData);
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

        deleteUser: async (id) => {
          try {
            const response = await api.delete(`/users/${id}`);
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

        activateUser: async (id) => {
          try {
            const response = await api.patch(`/users/${id}/activate`);
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

        deactivateUser: async (id) => {
          try {
            const response = await api.patch(`/users/${id}/deactivate`);
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

        getUsersByRole: async (role, page = 1, pageSize = 10) => {
          try {
            const response = await api.get(`/users/role/${role}`, {
              params: {
                page,
                limit: pageSize,
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
      }),
      {
        name: "users-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    )
  )
);
