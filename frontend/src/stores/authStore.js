import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/base.api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),

      login: async (email, phone, otp, userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.verifyOtp({
            email,
            phone,
            otp,
            ...userData,
          });
          if (response.success) {
            set({
              user: response.data.user,
              token: response.data.session.access_token,
              isAuthenticated: true,
              isLoading: false,
            });
            return response;
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
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
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.updateProfile(updates);
          if (response.success) {
            set({ user: response.data });
          }
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refreshUser: async () => {
        try {
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            set({ user: response.data });
          }
          return response;
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
