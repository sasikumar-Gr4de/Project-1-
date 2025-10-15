import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { authAPI } from "../services/api";

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        permissions: [],
        session: null,
        needsEmailVerification: false,

        setNeedsEmailVerification: (needs) =>
          set({ needsEmailVerification: needs }),

        // Login function
        login: async (email, password) => {
          set({ isLoading: true });
          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
              // Store token
              if (result.data.token) {
                localStorage.setItem("auth_token", result.data.token);
              }

              set({
                user: result.data.user,
                session: result.data.session || null,
                needsEmailVerification: result.data.needsVerification || false,
              });

              return {
                success: true,
                user: result.data.user,
                needsVerification: result.data.needsVerification,
              };
            } else {
              return {
                success: false,
                error: result.message,
                needsVerification: result.needsVerification,
              };
            }
          } catch (error) {
            return { success: false, error: error.message };
          } finally {
            set({ isLoading: false });
          }
        },

        // Register function
        register: async (userData) => {
          set({ isLoading: true });
          try {
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });

            const result = await response.json();

            if (result.success) {
              // Store token
              if (result.data.token) {
                localStorage.setItem("auth_token", result.data.token);
              }

              set({
                user: result.data.user,
                needsEmailVerification:
                  result.data.needsEmailVerification || false,
              });

              return {
                success: true,
                user: result.data.user,
                needsVerification: result.data.needsEmailVerification,
              };
            } else {
              return { success: false, error: result.message };
            }
          } catch (error) {
            return { success: false, error: error.message };
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          try {
            const token = localStorage.getItem("auth_token");

            if (token) {
              await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
            }

            // Clear local storage
            localStorage.removeItem("auth_token");

            // Clear state
            set({
              user: null,
              session: null,
              needsEmailVerification: false,
            });

            return { success: true };
          } catch (error) {
            console.error("Logout error:", error);
            // Still clear local data even if API call fails
            localStorage.removeItem("auth_token");
            set({ user: null, session: null, needsEmailVerification: false });
            return { success: false, error: error.message };
          }
        },

        initializeAuth: async () => {
          try {
            const token = localStorage.getItem("auth_token");

            if (!token) {
              return { user: null, needsVerification: false };
            }

            // Verify token and get user data
            const response = await fetch("/api/auth/profile", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const result = await response.json();
              const user = result.data.user;

              set({
                user: user,
                needsEmailVerification: !user.email_verified,
              });

              return { user, needsVerification: !user.email_verified };
            } else {
              // Token is invalid, clear it
              localStorage.removeItem("auth_token");
              return { user: null, needsVerification: false };
            }
          } catch (error) {
            console.error("Error initializing auth:", error);
            localStorage.removeItem("auth_token");
            return { user: null, needsVerification: false };
          }
        },

        checkEmailVerification: async () => {
          try {
            const token = localStorage.getItem("auth_token");

            if (!token) {
              return false;
            }

            const response = await fetch("/api/auth/verification-status", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              const result = await response.json();
              const isVerified = result.data.email_verified;

              set({ needsEmailVerification: !isVerified });
              return !isVerified;
            }

            return false;
          } catch (error) {
            console.error("Error checking email verification:", error);
            return false;
          }
        },

        // Verify email using backend endpoint
        verifyEmail: async (token) => {
          try {
            const response = await fetch("/api/auth/verify-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });

            const result = await response.json();

            if (result.success) {
              // Update local state
              set({
                needsEmailVerification: false,
                user: { ...get().user, email_verified: true },
              });

              // Store the new token
              if (result.data.token) {
                localStorage.setItem("auth_token", result.data.token);
              }

              return { success: true, user: result.data.user };
            } else {
              return { success: false, error: result.message };
            }
          } catch (error) {
            console.error("Email verification error:", error);
            return { success: false, error: "Failed to verify email" };
          }
        },

        // Resend verification email via backend
        resendVerificationEmail: async (email) => {
          try {
            const response = await fetch("/api/auth/resend-verification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            });

            const result = await response.json();
            return result;
          } catch (error) {
            console.error("Resend verification error:", error);
            return {
              success: false,
              error: "Failed to resend verification email",
            };
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
            localStorage.setItem("auth-token", token);
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
    ),
    {
      name: "auth-store", // This will appear in Redux DevTools
      store: "authStore", // Optional identifier
    }
  )
);

// Permission definitions (unchanged)
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
