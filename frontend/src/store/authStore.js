import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../services/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      permissions: [],
      session: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(email, password);
          const { user, token } = response.data.data;

          localStorage.setItem("token", token);
          const permissions = getPermissionsForRole(user.role);

          set({
            user,
            isAuthenticated: true,
            permissions,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || "Login failed",
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data.data;

          localStorage.setItem("token", token);
          const permissions = getPermissionsForRole(user.role);

          set({
            user,
            isAuthenticated: true,
            permissions,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || "Registration failed",
          };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            isAuthenticated: false,
            permissions: [],
            session: null,
          });
        }
      },

      initializeAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ isAuthenticated: false, user: null, permissions: [] });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await authAPI.getProfile();
          const user = response.data.data.user;
          const permissions = getPermissionsForRole(user.role);

          set({
            user,
            isAuthenticated: true,
            permissions,
            isLoading: false,
          });
        } catch (error) {
          localStorage.removeItem("token");
          set({
            user: null,
            isAuthenticated: false,
            permissions: [],
            isLoading: false,
          });
        }
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      hasAnyPermission: (requiredPermissions) => {
        const { permissions } = get();
        return requiredPermissions.some((permission) =>
          permissions.includes(permission)
        );
      },

      hasAllPermissions: (requiredPermissions) => {
        const { permissions } = get();
        return requiredPermissions.every((permission) =>
          permissions.includes(permission)
        );
      },

      updateProfile: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      refreshToken: async () => {
        try {
          const response = await authAPI.refreshToken();
          const { token } = response.data.data;
          localStorage.setItem("token", token);
          return { success: true };
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
          return { success: false };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);

// Permission definitions
const getPermissionsForRole = (role) => {
  const rolePermissions = {
    admin: [
      "view_dashboard",
      "manage_users",
      "manage_players",
      "manage_matches",
      "manage_teams",
      "manage_tournaments",
      "view_analytics",
      "export_data",
      "upload_videos",
      "manage_lineups",
      "access_admin_panel",
      "review_data",
      "tag_events",
      "export_team_data",
      "compare_players",
      "export_player_data",
      "create_reports",
      "system_settings",
    ],
    "data-reviewer": [
      "view_dashboard",
      "manage_players",
      "manage_matches",
      "view_analytics",
      "export_data",
      "upload_videos",
      "review_data",
      "tag_events",
      "compare_players",
      "export_player_data",
      "create_reports",
    ],
    annotator: [
      "view_dashboard",
      "view_players",
      "view_matches",
      "upload_videos",
      "tag_events",
      "view_basic_analytics",
    ],
    coach: [
      "view_dashboard",
      "view_players",
      "view_matches",
      "manage_lineups",
      "view_analytics",
      "export_team_data",
      "compare_players",
      "create_reports",
    ],
    scout: [
      "view_dashboard",
      "view_players",
      "view_matches",
      "view_analytics",
      "export_player_data",
      "compare_players",
      "create_reports",
    ],
    client: [
      "view_dashboard",
      "view_players",
      "view_matches",
      "view_basic_analytics",
    ],
  };

  return rolePermissions[role] || ["view_dashboard"];
};
