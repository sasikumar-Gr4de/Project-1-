// authStore.js - Fixed to work with current base.api.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/services/base.api"; // Import the axios instance

// Create API methods using the axios instance
const authAPI = {
  sendOtp: (data) => api.post("/auth/send-otp", data),
  verifyOtp: (data) => api.post("/auth/verify-otp", data),
  getCurrentUser: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  updateProfile: (data) => api.patch("/users/profile", data),
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        // Also store in localStorage for axios interceptor
        if (token) {
          localStorage.setItem("auth-token", token);
        }
      },

      login: async (email, phone, otp, userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.verifyOtp({
            email,
            phone,
            otp,
            ...userData,
          });

          if (response.data.success) {
            const { user, session } = response.data.data;
            const token = session.access_token;

            // Store token in localStorage for axios interceptor
            localStorage.setItem("auth-token", token);

            set({
              user: user,
              token: token,
              isAuthenticated: true,
              isLoading: false,
            });
            return response.data;
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        // Clear token from localStorage for axios interceptor
        localStorage.removeItem("auth-token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      sendOtp: async (email, phone) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.sendOtp({ email, phone });
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.updateProfile(updates);
          if (response.data.success) {
            set({ user: response.data.data });
          }
          set({ isLoading: false });
          return response.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
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
          throw error;
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
  )
);
