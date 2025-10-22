import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { INACTIVE_403, NOT_AUTHORIZED_401 } from "../utils/messages.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: NOT_AUTHORIZED_401,
      });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { userId } = decoded;

      const user = await User.findById(userId);

      if (user && user.is_active === false)
        return res.status(403).json({
          success: false,
          message: INACTIVE_403,
        });

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
        const { userId } = decoded;
        const user = await User.findById(userId);
        if (user && user.is_active === false)
          return res.status(403).json({
            success: false,
            message: INACTIVE_403,
          });

        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          clientType: user.client_type,
        };
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
