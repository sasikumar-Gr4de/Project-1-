import api from "@/services/base.api";

export const subscriptionService = {
  // Create checkout session
  createCheckoutSession: async (priceId) => {
    const response = await api.post("/subscriptions/create-checkout-session", {
      priceId,
    });
    return response.data;
  },

  // Create portal session
  createPortalSession: async () => {
    const response = await api.post("/subscriptions/create-portal-session");
    return response.data;
  },

  // Get current subscription
  getSubscription: async () => {
    const response = await api.get("/subscriptions/current");
    return response.data;
  },

  // Get available plans
  getPlans: async () => {
    const response = await api.get("/subscriptions/plans");
    return response.data;
  },

  // Check feature access
  checkAccess: async (feature) => {
    const response = await api.post("/subscriptions/check-access", { feature });
    return response.data;
  },

  // Sync subscription
  syncSubscription: async () => {
    const response = await api.post("/subscriptions/sync");
    return response.data;
  },
};
