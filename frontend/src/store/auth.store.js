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

        login: async (email, password) => {
          try {
            const response = await api.post("/auth/login", { email, password });
            const result = response.data;
            if (result.success) {
              const {
                user,
                user: { email_verified },
                token,
              } = result.data;

              if (email_verified === false) return result;

              set({ user: user });
              localStorage.setItem("auth-token", token);
            }
            return result;
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
            const result = response.data;

            if (result.success) {
              const { data } = result;
              const { token } = data;
              localStorage.setItem("auth-token", token);
              set({ user: data, isAuthenticated: true });
              return {
                success: true,
                data,
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
          localStorage.removeItem("auth-storage");
          set({
            user: null,
            permissions: [],
            isAuthenticated: false,
            email_verified: false,
          });
          window.location = "/";
        },

        checkVerificationStatus: async () => {
          try {
            const response = await api.get("/auth/verify-status");
            const result = response.data;
            const { success, data } = result;
            if (success === true) {
              const { email_verified } = data;
              set({ user: { ...get().user, email_verified } });
            }
            return result;
          } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        sendVerificationEmail: async (email) => {
          try {
            await api.post("/auth/verify-resend", { email });
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
