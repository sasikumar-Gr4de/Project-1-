import { RESPONSES, AUTH_MESSAGES } from "../utils/messages.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Verify JWT token from Authorization header
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    // Verify token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.INVALID_TOKEN));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Check if user has required role
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { data: userProfile, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", req.user.id)
        .single();

      if (error || !userProfile) {
        return res
          .status(403)
          .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.UNAUTHORIZED_ACCESS));
      }

      if (!allowedRoles.includes(userProfile.role)) {
        return res
          .status(403)
          .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.UNAUTHORIZED_ACCESS));
      }

      req.user.role = userProfile.role;
      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      return res
        .status(500)
        .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
    }
  };
};

/**
 * Check if user can access resource (own data or admin)
 */
export const canAccessUserData = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId || req.body.user_id;

    // Allow access to own data
    if (requestedUserId === req.user.id) {
      return next();
    }

    // Check if user is admin
    const { data: userProfile, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !userProfile || userProfile.role !== "admin") {
      return res
        .status(403)
        .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.UNAUTHORIZED_ACCESS));
    }

    next();
  } catch (error) {
    console.error("Access control middleware error:", error);
    return res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};
