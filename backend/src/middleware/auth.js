// middleware/auth.js - Updated for custom tokens
import { RESPONSES, AUTH_MESSAGES } from "../utils/messages.js";
import { verifyCustomToken } from "../services/tokenService.js";
import { supabase } from "../config/supabase.config.js";

/**
 * Verify custom JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    // Verify custom token
    const decoded = verifyCustomToken(token);

    // Get user profile from database
    const { data: userProfile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decoded.userId)
      .single();

    if (error || !userProfile) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.USER_NOT_FOUND));
    }

    req.user = userProfile;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_EXPIRED));
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.INVALID_TOKEN));
    }

    return res
      .status(500)
      .json(RESPONSES.SERVER_ERROR(AUTH_MESSAGES.INTERNAL_ERROR));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (token) {
        // Verify custom token
        const decoded = verifyCustomToken(token);

        // Get user profile from database
        const { data: userProfile, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", decoded.userId)
          .single();

        if (!error && userProfile) {
          req.user = userProfile;
        }
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json(RESPONSES.UNAUTHORIZED(AUTH_MESSAGES.TOKEN_REQUIRED));
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(RESPONSES.FORBIDDEN(AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
};
