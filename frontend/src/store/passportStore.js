import { create } from "zustand";
import { passportService } from "@/services/passport.service";

export const usePassportStore = create((set, get) => ({
  // State
  passport: null,
  metrics: [],
  timeline: [],
  verificationStatus: null,
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Get complete passport
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

  // Update identity
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
            identity: response.data,
          },
          isLoading: false,
        });
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

  // Upload verification document
  uploadVerification: async (playerId, documentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.uploadVerification(
        playerId,
        documentData
      );

      // Update local state
      const currentPassport = get().passport;
      if (currentPassport) {
        set({
          passport: {
            ...currentPassport,
            verifications: [
              ...(currentPassport.verifications || []),
              response.data,
            ],
            verificationBadge: calculateVerificationBadge([
              ...(currentPassport.verifications || []),
              response.data,
            ]),
          },
          isLoading: false,
        });
      }

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to upload verification",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get metrics with date range
  fetchPlayerMetrics: async (playerId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.getPlayerMetrics(playerId, params);
      set({
        metrics: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch metrics",
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPendingVerifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await passportService.getPendingVerifications();

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(response);
      const data = response.data;

      if (data.success) {
        set({ pendingVerifications: data.data.items || [], isLoading: false });
        return data.data.items;
      } else {
        throw new Error(data.message || "Failed to load verifications");
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch pending verifications", isLoading: false });
      throw error;
    }
  },

  // Clear passport data
  clearPassport: () =>
    set({
      passport: null,
      metrics: [],
      timeline: [],
      verificationStatus: null,
    }),
}));

// Helper function
const calculateVerificationBadge = (verifications) => {
  if (!verifications || verifications.length === 0) {
    return { status: "unverified", label: "Unverified", color: "gray" };
  }

  const approvedDocs = verifications.filter((v) => v.status === "approved");
  const pendingDocs = verifications.filter((v) => v.status === "pending");
  const rejectedDocs = verifications.filter((v) => v.status === "rejected");

  if (approvedDocs.length >= 2) {
    return { status: "verified", label: "Verified", color: "green" };
  } else if (rejectedDocs.length > 0) {
    return { status: "rejected", label: "Documents Rejected", color: "red" };
  } else if (pendingDocs.length > 0) {
    return { status: "pending", label: "Under Review", color: "yellow" };
  }

  return { status: "unverified", label: "Unverified", color: "gray" };
};
