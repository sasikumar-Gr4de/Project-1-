import { RESPONSES, AUTH_MESSAGES } from "../utils/messages.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Enhanced JWT token verification with proper error handling
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

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

    if (error) {
      console.error("Token verification error:", error);
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.INVALID_TOKEN));
    }

    if (!user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.INVALID_TOKEN));
    }

    // Get user profile with role information
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*, role")
      .eq("id", user.id)
      .single();

    if (profileError || !userProfile) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.USER_NOT_FOUND));
    }

    // Attach complete user data to request
    req.user = {
      ...user,
      ...userProfile,
      role: userProfile.role || "player", // Default role
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    // If no roles specified, allow all authenticated users
    if (allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
};

/**
 * Resource ownership middleware
 */
export const canAccessUserData = (paramKey = "userId") => {
  return async (req, res, next) => {
    try {
      const requestedUserId = req.params[paramKey] || req.body.user_id;

      if (!requestedUserId) {
        return res
          .status(400)
          .json(RESPONSES.BAD_REQUEST("User ID is required"));
      }

      // Allow access to own data
      if (requestedUserId === req.user.id) {
        return next();
      }

      // Admins can access any data
      if (req.user.role === "admin") {
        return next();
      }

      return res
        .status(403)
        .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.UNAUTHORIZED_ACCESS));
    } catch (error) {
      console.error("Access control middleware error:", error);
      return res
        .status(500)
        .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
    }
  };
};

/**
 * Optional authentication middleware
 * - Sets req.user if token is valid, but doesn't block request
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (token) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token);

        if (!error && user) {
          const { data: userProfile } = await supabase
            .from("users")
            .select("*, role")
            .eq("id", user.id)
            .single();

          if (userProfile) {
            req.user = {
              ...user,
              ...userProfile,
              role: userProfile.role || "player",
            };
          }
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication on error
    console.error("Optional auth middleware error:", error);
    next();
  }
};
