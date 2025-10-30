// store/authStore.js - Professional version
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from "@/services/base.api";

// API methods
const authAPI = {
  sendOtp: (data) => api.post("/auth/send-otp", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  updateProfile: (data) => api.patch("/auth/profile", data),
};

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,

        // Actions
        initializeAuth: async () => {
          const token = localStorage.getItem("auth-token");
          if (!token) {
            set({ isInitialized: true });
            return false;
          }

          try {
            const response = await authAPI.getCurrentUser();
            if (response.data.success) {
              set({
                user: response.data.data,
                token,
                isAuthenticated: true,
                isInitialized: true,
              });
              return true;
            }
          } catch (error) {
            console.error("Auth initialization failed:", error);
            localStorage.removeItem("auth-token");
          }

          set({ isInitialized: true });
          return false;
        },

        sendOtp: async (email, phone) => {
          set({ isLoading: true });
          try {
            const response = await authAPI.sendOtp({
              ...(email && { email }),
              ...(phone && { phone }),
            });
            return response.data;
          } catch (error) {
            throw error.response?.data || error;
          } finally {
            set({ isLoading: false });
          }
        },

        login: async (email, phone, otp, userData = {}) => {
          set({ isLoading: true });
          try {
            const response = await authAPI.verifyOtp({
              ...(email && { email }),
              ...(phone && { phone }),
              otp,
              ...userData,
            });

            if (response.data.success) {
              const { user, token, requires_onboarding } = response.data.data;

              if (token) {
                localStorage.setItem("auth-token", token);

                set({
                  user: {
                    ...user,
                    requires_onboarding:
                      requires_onboarding || !user.player_name,
                  },
                  token,
                  isAuthenticated: true,
                });
              }

              return response.data;
            }
          } catch (error) {
            throw error.response?.data || error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateProfile: async (updates) => {
          set({ isLoading: true });
          try {
            const response = await authAPI.updateProfile(updates);
            if (response.data.success) {
              const updatedUser = { ...get().user, ...response.data.data };
              set({
                user: updatedUser,
              });
            }
            return response.data;
          } catch (error) {
            throw error.response?.data || error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error("Logout error:", error);
          } finally {
            localStorage.removeItem("auth-token");
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
          }
        },

        refreshUser: async () => {
          try {
            const response = await authAPI.getCurrentUser();
            if (response.data.success) {
              set({ user: response.data.data });
            }
            return response.data;
          } catch (error) {
            throw error.response?.data || error;
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);
