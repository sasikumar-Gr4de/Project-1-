export const ROUTES = {
  // Public routes
  PUBLIC: {
    LANDING: "/",
    LOGIN: "/login",
    SUBSCRIPTION: "/subscription",
    SUBSCRIPTION_SUCCESS: "/subscription/success",
    UNAUTHORIZED: "/unauthorized",
    NOT_FOUND: "/404",
  },

  // Auth routes
  AUTH: {
    ONBOARDING: "/onboarding",
  },

  // Player routes
  PLAYER: {
    DASHBOARD: "/dashboard",
    UPLOAD: "/upload",
    REPORTS: "/reports",
    REPORT_DETAIL: "/reports/:reportId",
    BENCHMARKS: "/benchmarks",
    PROFILE: "/profile",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    QUEUE: "/admin/queue",
    USERS: "/admin/users",
    REPORTS: "/admin/reports",
    CONTENT: "/admin/content",
    ANALYTICS: "/admin/analytics",
  },

  // Developer routes
  DEVELOPER: {
    SERVER_UPLOAD: "/server-upload",
  },
};

export const USER_ROLES = {
  PLAYER: "player",
  ADMIN: "admin",
};

// Route access configuration
export const ROUTE_ACCESS = {
  [ROUTES.PLAYER.DASHBOARD]: [USER_ROLES.PLAYER, USER_ROLES.ADMIN],
  [ROUTES.PLAYER.UPLOAD]: [USER_ROLES.PLAYER, USER_ROLES.ADMIN],
  [ROUTES.PLAYER.REPORTS]: [USER_ROLES.PLAYER, USER_ROLES.ADMIN],
  [ROUTES.PLAYER.BENCHMARKS]: [USER_ROLES.PLAYER, USER_ROLES.ADMIN],
  [ROUTES.PLAYER.PROFILE]: [USER_ROLES.PLAYER, USER_ROLES.ADMIN],
  [ROUTES.ADMIN.DASHBOARD]: [USER_ROLES.ADMIN],
  [ROUTES.ADMIN.QUEUE]: [USER_ROLES.ADMIN],
  [ROUTES.ADMIN.USERS]: [USER_ROLES.ADMIN],
  [ROUTES.ADMIN.REPORTS]: [USER_ROLES.ADMIN],
  [ROUTES.ADMIN.CONTENT]: [USER_ROLES.ADMIN],
  [ROUTES.ADMIN.ANALYTICS]: [USER_ROLES.ADMIN],
};
