import { create } from "zustand";
import { passportService } from "@/services/passport.service";

// Passport API methods
const passportAPI = {
  getPassport: () => passportService.getPlayerPassport(),
  updatePassport: (data) => passportService.updatePlayerPassport(data),
  uploadFiles: (data) => passportService.uploadPassportFiles(data),
  getStatus: () => passportService.getVerificationStatus(),
  createShareLink: (data) => passportService.createShareLink(data),
  revokeShareLink: (data) => passportService.revokeShareLink(data),
  getPublicPassport: (token) => passportService.getPublicPassport(token),
};

export const usePassportStore = create((set, get) => ({
  // State
  passport: null,
  verificationStatus: null,
  isLoading: false,
  error: null,
  pendingVerifications: null,
  shareLink: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Passport
  fetchPlayerPassport: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.getPassport();
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
  updatePlayerIdentity: async (identityData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.updatePassport({
        identity: identityData,
      });

      // Update local state
      const currentPassport = get().passport;
      if (currentPassport) {
        set({
          passport: {
            ...currentPassport,
            identity: { ...currentPassport.identity, ...identityData },
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

  uploadHeadshot: async (headshotUrl) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.uploadFiles({
        file_url: headshotUrl,
        file_type: "headshot",
      });

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

  // Verification
  getVerificationStatus: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.getStatus();
      set({
        verificationStatus: response.data,
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

  uploadVerification: async (documentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.uploadFiles({
        file_url: documentData.file_url,
        file_type: "document",
        document_type: documentData.document_type,
      });

      // Refresh verification status to get updated state
      await get().getVerificationStatus();

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

  // Share link management
  createShareLink: async (expiresInDays = 30) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.createShareLink({
        expires_in_days: expiresInDays,
      });
      set({
        shareLink: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create share link",
        isLoading: false,
      });
      throw error;
    }
  },

  revokeShareLink: async (shareToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportAPI.revokeShareLink({
        share_token: shareToken,
      });
      set({
        shareLink: null,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to revoke share link",
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
      shareLink: null,
    }),

  restartVerification: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.restartVerification();

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;

      if (data.success) {
        // Refresh verification status to get updated state
        await get().getVerificationStatus();

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
