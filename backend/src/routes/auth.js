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
  changePassword,
  deleteAccount,
  sendVerificationEmail,
  checkVerificationStatus,
  getPermissionsForRole,
  getStats,
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
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.post("/resend-verification", protect, sendVerificationEmail);

/**
 * @route   GET /api/auth/verification-status
 * @desc    Resend email verification
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get("/verification-status", protect, checkVerificationStatus);

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
router.get("/session", optionalAuth, getSession);

/**
 * @route   GET /api/auth/permissions
 * @desc    Get current user permissions
 * @access  Private
 * @header  Authorization: Bearer <token>
 */
router.get("/permissions", protect, getPermissionsForRole);

/**
 * @route   GET /api/auth/stats
 * @desc    Get user statistics (admin only)
 * @access  Private (Admin)
 * @header  Authorization: Bearer <token>
 */
router.get("/stats", protect, getStats);

export default router;
