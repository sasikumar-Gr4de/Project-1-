import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { zustandEncryptedStorage } from "@/utils/storage.utils.js";
import api from "@/services/base.api.js";

export const useAuthstore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        permissions: [],
        email_verified: false,
        login: async (email, password) => {
          try {
            const response = await api.login(email, password);
            const result = response.data;
            console.log(result);
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },
        register: async (userData) => {
          try {
            console.log("register axios");
            const response = await api.post("/auth/register", userData);
            console.log(response);
            if (response.success) {
              const { token, data } = result.data;
              localStorage.setItem("auth-token", token);
              console.log(token);
              return {
                success: true,
                user: data,
              };
            } else {
              return { success: false, error: result.message };
            }
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        logout: async () => {
          localStorage.removeItem("auth-token");
          set({
            user: null,
            permissions: [],
            isAuthenticated: false,
            email_verified: false,
          });
        },
      }),
      {
        name: "auth-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          permissions: state.permissions,
          email_verified: state.email_verified,
        }),
      }
    )
  )
);
