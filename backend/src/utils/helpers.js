import jwt from "jsonwebtoken";

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
