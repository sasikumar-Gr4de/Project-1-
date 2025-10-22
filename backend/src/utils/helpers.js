import jwt from "jsonwebtoken";
import { COMMON_SERVER_ERROR } from "./messages.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const generateResponse = (data = null, message) => {
  if (!data) {
    return {
      success: false,
      message,
    };
  }
  return {
    success: true,
    data,
    message,
  };
};

export const generateValidationResult = (message = null) => {
  if (!message) {
    return {
      success: true,
    };
  }
  return {
    success: false,
    message,
  };
};

export const sendServerErrorResponse = (req, res, err) => {
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : COMMON_SERVER_ERROR,
  });
};
