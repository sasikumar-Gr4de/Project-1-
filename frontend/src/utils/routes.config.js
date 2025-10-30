// Route paths
export const ROUTES = {
  // Public routes
  LANDING: "/",
  LOGIN: "/login",
  UNAUTHORIZED: "/unauthorized",

  // Auth routes
  ONBOARDING: "/onboarding",

  // Player routes
  DASHBOARD: "/dashboard",
  UPLOAD: "/upload",
  REPORTS: "/reports",
  REPORT_DETAIL: "/reports/:reportId",
  BENCHMARKS: "/benchmarks",
  PROFILE: "/profile",

  // Admin routes
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",

  // Developer routes
  SERVER_UPLOAD: "/server/upload-image",
};

// Route permissions
export const ROUTE_PERMISSIONS = {
  [ROUTES.LANDING]: { public: true },
  [ROUTES.LOGIN]: { public: true },
  [ROUTES.UNAUTHORIZED]: { public: true },
  [ROUTES.ONBOARDING]: { protected: true, requireOnboarding: true },
  [ROUTES.DASHBOARD]: { protected: true, roles: ["player", "admin"] },
  [ROUTES.UPLOAD]: { protected: true, roles: ["player"] },
  [ROUTES.REPORTS]: { protected: true, roles: ["player"] },
  [ROUTES.REPORT_DETAIL]: { protected: true, roles: ["player"] },
  [ROUTES.BENCHMARKS]: { protected: true, roles: ["player"] },
  [ROUTES.PROFILE]: { protected: true, roles: ["player", "admin"] },
  [ROUTES.ADMIN]: { protected: true, roles: ["admin"] },
  [ROUTES.ADMIN_DASHBOARD]: { protected: true, roles: ["admin"] },
  [ROUTES.SERVER_UPLOAD]: { public: true }, // Developer route
};

// Navigation configuration
export const NAVIGATION = {
  player: [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "dashboard" },
    { path: ROUTES.UPLOAD, label: "Upload", icon: "upload" },
    { path: ROUTES.REPORTS, label: "Reports", icon: "reports" },
    { path: ROUTES.BENCHMARKS, label: "Benchmarks", icon: "benchmarks" },
    { path: ROUTES.PROFILE, label: "Profile", icon: "profile" },
  ],
  admin: [
    { path: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", icon: "dashboard" },
    { path: ROUTES.PROFILE, label: "Profile", icon: "profile" },
  ],
};

// Helper functions
export const getRoutePermissions = (path) => {
  return ROUTE_PERMISSIONS[path] || { public: false };
};

export const isPublicRoute = (path) => {
  return getRoutePermissions(path).public === true;
};

export const isProtectedRoute = (path) => {
  return getRoutePermissions(path).protected === true;
};

export const getAllowedRoles = (path) => {
  return getRoutePermissions(path).roles || [];
};

export const requiresOnboarding = (path) => {
  return getRoutePermissions(path).requireOnboarding === true;
};
