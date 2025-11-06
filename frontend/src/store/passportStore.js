import { create } from "zustand";
import { passportService } from "@/services/passport.service";

export const usePassportStore = create((set, get) => ({
  // State
  passport: null,
  verificationStatus: null,
  isLoading: false,
  error: null,
  pendingVerifications: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Passport
  fetchPlayerPassport: async (playerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.getPlayerPassport(playerId);
      set({
        passport: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch passport",
        isLoading: false,
      });
      throw error;
    }
  },

  // Identity
  updatePlayerIdentity: async (playerId, identityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.updatePlayerIdentity(
        playerId,
        identityData
      );

      // Update local state
      const currentPassport = get().passport;
      if (currentPassport) {
        set({
          passport: {
            ...currentPassport,
            identity: { ...currentPassport.identity, ...response.data },
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update identity",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadHeadshot: async (playerId, headshotUrl) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.uploadHeadshot(
        playerId,
        headshotUrl
      );

      // Update local state
      const currentPassport = get().passport;
      if (currentPassport) {
        set({
          passport: {
            ...currentPassport,
            identity: {
              ...currentPassport.identity,
              headshot_url: headshotUrl,
            },
          },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload headshot",
        isLoading: false,
      });
      throw error;
    }
  },

  // Verification - FIXED: Added missing getVerificationStatus function
  getVerificationStatus: async (playerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.getVerificationStatus(playerId);
      set({
        verificationStatus: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch verification status",
        isLoading: false,
      });
      throw error;
    }
  },

  uploadVerification: async (playerId, documentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.uploadVerification(
        playerId,
        documentData
      );

      // Refresh verification status to get updated state
      await get().getVerificationStatus(playerId);

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload verification",
        isLoading: false,
      });
      throw error;
    }
  },

  // Admin verification functions
  fetchPendingVerifications: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.getPendingVerifications(filters);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      if (data.success) {
        set({
          pendingVerifications: data.data,
          isLoading: false,
        });
        return data.data;
      } else {
        throw new Error(data.message || "Failed to load verifications");
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch verifications",
        isLoading: false,
      });
      throw error;
    }
  },

  handleReviewVerification: async (verificationId, reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.reviewVerification(
        verificationId,
        reviewData
      );

      // Refresh pending verifications list
      await get().fetchPendingVerifications();

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to review verification",
        isLoading: false,
      });
      throw error;
    }
  },

  clearPassport: () =>
    set({
      passport: null,
      verificationStatus: null,
      pendingVerifications: null,
    }),

  restartVerification: async (playerId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.restartVerification(playerId);

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      if (data.success) {
        // Refresh verification status to get updated state
        await get().getVerificationStatus(playerId);

        set({ isLoading: false });
        return data.data;
      } else {
        throw new Error(data.message || "Failed to restart verification");
      }
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to restart verification",
        isLoading: false,
      });
      throw error;
    }
  },
}));
