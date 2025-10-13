import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

export const project = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. No token provided.",
      });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", decoded.id)
        .single();

      if (error || !user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found or token invalid" });
      }

      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: "User account is inactive. Please contact support.",
        });
      }

      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        clientType: user.client_type,
      };
      next();
    } catch (JWTError) {
      return res.status(401).json({
        success: false,
        message: "Token verification failed. Please log in again.",
      });
    }
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error in authentication" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${
          req.user.role
        } is not authorized to access this route. Required roles: ${roles.join(
          ", "
        )}`,
      });
    }
    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("id", decoded.userId)
          .single();

        if (user && user.is_active) {
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            clientType: user.client_type,
          };
        }
      } catch (error) {
        // Token is invalid, but we continue without user
        console.log("Optional auth: Invalid token, continuing without user");
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next();
  }
};
