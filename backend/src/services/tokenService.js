import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateCustomToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role || "player",
    type: "access_token",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: "gr4de-platform",
    subject: user.id,
    jwtid: uuidv4(), // Unique token ID
  });
};

export const verifyCustomToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    type: "refresh_token",
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    issuer: "gr4de-platform",
    subject: user.id,
    jwtid: uuidv4(),
  });
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

// Helper function to generate UUID
export const generateUUID = () => {
  return uuidv4();
};
