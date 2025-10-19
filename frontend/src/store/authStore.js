import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { authAPI } from "@/services/api";
import { useToastStore } from "@/store/toastStore";

import { zustandEncryptedStorage } from "@/utils/storage";

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        permissions: [],
        session: null,
        email_verified: false,

        // Login function using authAPI
        login: async (email, password) => {
          debugger;
          set({ isLoading: true });
          try {
            const response = await authAPI.login(email, password);
            const result = response.data;

            if (result.success) {
              set({
                user: result.data.user,
                session: result.data.session || null,
                email_verified: result.data.email_verified || false,
                isAuthenticated: true,
              });
              debugger;
              const { token } = result?.data;
              localStorage.setItem("auth-token", token);

              return {
                success: true,
                user: result.data.user,
                email_verified: result.data.email_verified || false,
              };
            } else {
              return {
                success: false,
                error: result.message,
                email_verified: result.email_verified,
              };
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            useToastStore.getState().error(errorMessage || "Login failed.");

            return {
              success: false,
              error: errorMessage,
              email_verified: error.response?.data?.email_verified,
            };
          } finally {
            set({ isLoading: false });
          }
        },

        // Register function using authAPI
        register: async (userData) => {
          set({ isLoading: true });
          try {
            const response = await authAPI.register(userData);
            const result = response.data;

            if (result.success) {
              set({
                user: result.data.user,
                email_verified: result.data.email_verified || false,
                isAuthenticated: true,
              });
              debugger;
              const { token } = result.data;

              localStorage.setItem("auth-token", token);
              return {
                success: true,
                user: result.data.user,
                email_verified: result.data.email_verified,
              };
            } else {
              return { success: false, error: result.message };
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            return { success: false, error: errorMessage };
          } finally {
            set({ isLoading: false });
          }
        },

        // Logout using authAPI
        logout: async () => {
          try {
            await authAPI.logout();
          } catch (error) {
            console.error("Logout API error:", error);
            // Continue with cleanup even if API call fails
          } finally {
            // Clear local storage
            localStorage.removeItem("auth-token");

            // Clear state
            set({
              user: null,
              session: null,
              email_verified: false,
              isAuthenticated: false,
              permissions: [],
            });
          }

          return { success: true };
        },

        // Initialize auth using authAPI
        initializeAuth: async () => {
          try {
            const token = localStorage.getItem("auth-token");

            if (!token) {
              return { user: null, email_verified: false };
            }

            const response = await authAPI.getProfile();
            const result = response.data;

            if (result.success) {
              const { user, email_verified } = result.data;

              set({
                user: user,
                email_verified: email_verified || user.email_verified || false,
                isAuthenticated: true,
                permissions: getPermissionsForRole(user.role),
              });

              return {
                user,
                email_verified: email_verified || user.email_verified || false,
              };
            } else {
              // Token is invalid, clear it
              localStorage.removeItem("auth-token");
              return { user: null, email_verified: false };
            }
          } catch (error) {
            console.error("Error initializing auth:", error);

            localStorage.removeItem("auth-token");
            return { user: null, email_verified: false };
          }
        },

        // Check email verification using authAPI
        checkEmailVerification: async () => {
          try {
            const response = await authAPI.checkVerificationStatus();
            const result = response.data;
            debugger;
            if (result.success) {
              const isVerified = result.data.email_verified;
              set({ email_verified: isVerified });
              return isVerified;
            }

            return false;
          } catch (error) {
            console.error("Error checking email verification:", error);
            return false;
          }
        },

        // Resend verification email using authAPI
        resendVerificationEmail: async (email) => {
          try {
            const response = await authAPI.resendVerification(email);
            return response.data;
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error("Resend verification error:", errorMessage);
            return {
              success: false,
              error: errorMessage,
            };
          }
        },

        // Update profile using authAPI
        updateProfile: async (userData) => {
          try {
            const response = await authAPI.updateProfile(userData);
            const result = response.data;

            if (result.success) {
              const updatedUser = { ...get().user, ...result.data.user };
              set({
                user: updatedUser,
                email_verified:
                  result.data.user?.email_verified || get().email_verified,
              });
              return { success: true, user: updatedUser };
            } else {
              return { success: false, error: result.message };
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            return { success: false, error: errorMessage };
          }
        },

        // Refresh token using authAPI
        refreshToken: async () => {
          try {
            const response = await authAPI.refreshToken();
            const { token } = response.data.data;
            localStorage.setItem("auth-token", token);
            return { success: true };
          } catch (error) {
            console.error("Token refresh failed:", error);
            get().logout();
            return { success: false };
          }
        },

        // Permission check functions
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

        // Clear auth state (for manual cleanup)
        clearAuth: () => {
          localStorage.removeItem("auth-token");
          set({
            user: null,
            session: null,
            email_verified: false,
            isAuthenticated: false,
            permissions: [],
          });
        },
      }),
      {
        name: "auth-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          permissions: state.permissions,
          email_verified: state.email_verified,
        }),
      }
    ),
    {
      name: "auth-store",
      store: "authStore",
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
