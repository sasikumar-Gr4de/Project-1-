import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  refreshToken,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  changePassword,
  deleteAccount,
} from "../controllers/authController.js";

import { protect, optionalAuth } from "../middleware/auth.js";
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} from "../middleware/validation.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {string} email - User email
 * @body    {string} password - User password (min 6 characters)
 * @body    {string} full_name - User full name
 * @body    {string} role - User role (admin, data-reviewer, annotator, coach, scout, client)
 * @body    {string} [client_type] - Client type if role is client (coach, parent, scout)
 * @body    {string} [organization] - User organization
 * @body    {string} [phone_number] - User phone number
 */
router.post("/register", validateRegistration, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 * @body    {string} email - User email
 * @body    {string} password - User password
 */
router.post("/login", validateLogin, login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/refresh", protect, refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/logout", protect, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get("/profile", protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    {string} [full_name] - User full name
 * @body    {string} [organization] - User organization
 * @body    {string} [phone_number] - User phone number
 * @body    {string} [avatar_url] - User avatar URL
 */
router.put("/profile", protect, validateProfileUpdate, updateProfile);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    {string} current_password - Current password
 * @body    {string} new_password - New password (min 6 characters)
 * @body    {string} confirm_password - Confirm new password
 */
router.post("/change-password", protect, changePassword);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 * @body    {string} email - User email
 */
router.post("/forgot-password", requestPasswordReset);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 * @body    {string} token - Password reset token
 * @body    {string} new_password - New password (min 6 characters)
 * @body    {string} confirm_password - Confirm new password
 */
router.post("/reset-password", resetPassword);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 * @body    {string} token - Email verification token
 */
router.post("/verify-email", verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/resend-verification", protect, async (req, res) => {
  try {
    // This would typically send a new verification email
    // For now, we'll return a success message
    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending verification email",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete user account
 * @access  Private
 * @header  Authorization: Bearer <token>
 * @body    {string} password - User password for confirmation
 */
router.delete("/account", protect, deleteAccount);

/**
 * @route   GET /api/auth/session
 * @desc    Check authentication session
 * @access  Private (Optional - returns user if authenticated, public access otherwise)
 * @header  [Authorization: Bearer <token>] - Optional
 */
router.get("/session", optionalAuth, async (req, res) => {
  try {
    if (req.user) {
      res.json({
        success: true,
        data: {
          isAuthenticated: true,
          user: {
            id: req.user.userId,
            email: req.user.email,
            role: req.user.role,
            clientType: req.user.clientType,
          },
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking session",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

/**
 * @route   GET /api/auth/permissions
 * @desc    Get current user permissions
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get("/permissions", protect, async (req, res) => {
  try {
    const permissions = getPermissionsForRole(req.user.role);

    res.json({
      success: true,
      data: {
        permissions,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching permissions",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

/**
 * @route   GET /api/auth/stats
 * @desc    Get user statistics (admin only)
 * @access  Private (Admin)
 * @header  Authorization: Bearer <token>
 */
router.get("/stats", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required.",
      });
    }

    // This would typically fetch user statistics from the database
    // For now, return mock data
    const stats = {
      total_users: 150,
      active_users: 142,
      new_users_today: 3,
      new_users_this_week: 15,
      users_by_role: {
        admin: 2,
        "data-reviewer": 5,
        annotator: 25,
        coach: 45,
        scout: 28,
        client: 45,
      },
      verification_stats: {
        verified: 135,
        unverified: 15,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Helper function to get permissions for role
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

export default router;
