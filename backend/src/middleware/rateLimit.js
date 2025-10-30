// middleware/rateLimit.js - Professional version
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

// Redis client for distributed rate limiting (optional)
const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

const createRateLimiter = (options) => {
  const store = redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: "rate_limit:",
      })
    : undefined;

  return rateLimit({
    store,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: options.message,
        retryAfter: Math.ceil(options.windowMs / 1000),
        limit: options.max,
        window: options.windowMs,
      });
    },
    onLimitReached: (req, res, options) => {
      console.warn(`Rate limit reached for IP: ${req.ip}`, {
        path: req.path,
        method: req.method,
        user: req.user?.id || "anonymous",
      });
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    ...options,
  });
};

// OTP-specific rate limiting with stricter limits
export const otpRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Reduced to 3 attempts per 15 minutes for security
  message:
    "Too many OTP verification attempts. Please try again in 15 minutes.",
  keyGenerator: (req) => {
    // Rate limit by IP + email/phone to prevent abuse
    const identifier = req.body.email || req.body.phone || req.ip;
    return `otp:${identifier}`;
  },
  skipSuccessfulRequests: true, // Don't count successful OTP verifications
});

// Authentication rate limiting
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 minutes
  message: "Too many authentication attempts. Please try again in 15 minutes.",
  keyGenerator: (req) => {
    const identifier = req.body.email || req.body.phone || req.ip;
    return `auth:${identifier}`;
  },
});

// General API rate limiting with tiered limits
export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Different limits based on user status
    if (req.user?.role === "admin") return 1000;
    if (req.user) return 200; // Authenticated users
    return 100; // Anonymous users
  },
  message: "Too many API requests. Please slow down.",
  keyGenerator: (req) => {
    return req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
  },
});

// File upload rate limiting
export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Reduced to 5 uploads per hour
  message: "Too many file uploads. Please try again in an hour.",
  keyGenerator: (req) => `upload:${req.user?.id || req.ip}`,
});

// Password reset rate limiting
export const passwordResetRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset attempts per hour
  message: "Too many password reset attempts. Please try again in an hour.",
  keyGenerator: (req) => `pwd_reset:${req.body.email || req.ip}`,
});

// Admin endpoints rate limiting
export const adminRateLimit = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 requests per 5 minutes for admin endpoints
  message: "Too many admin requests. Please slow down.",
  keyGenerator: (req) => `admin:${req.user?.id || req.ip}`,
  skip: (req) => !req.user || req.user.role !== "admin", // Only apply to admins
});

// Bruteforce protection for sensitive endpoints
export const bruteForceLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: "Too many attempts. Please wait a minute before trying again.",
  keyGenerator: (req) => `bruteforce:${req.ip}`,
});

// Global rate limiting for additional protection
export const globalRateLimit = createRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: "Too many requests from your IP address. Please slow down.",
  keyGenerator: (req) => `global:${req.ip}`,
});

// Skip rate limiting for certain conditions
export const skipRateLimit = (req) => {
  // Skip rate limiting for health checks
  if (req.path === "/health" || req.path === "/status") return true;

  // Skip for internal IPs (if needed)
  const internalIps = ["127.0.0.1", "::1", "10.", "192.168."];
  if (internalIps.some((ip) => req.ip.startsWith(ip))) return true;

  // Skip for trusted users (admins, etc.)
  if (req.user?.role === "admin" && process.env.NODE_ENV !== "production") {
    return true;
  }

  return false;
};

// Rate limit headers middleware
export const rateLimitHeaders = (req, res, next) => {
  // Add rate limit info to response headers
  res.set({
    "X-RateLimit-Limit": req.rateLimit?.limit,
    "X-RateLimit-Remaining": req.rateLimit?.remaining,
    "X-RateLimit-Reset": req.rateLimit?.resetTime,
  });
  next();
};

export default {
  otpRateLimit,
  authRateLimit,
  apiRateLimit,
  uploadRateLimit,
  passwordResetRateLimit,
  adminRateLimit,
  bruteForceLimit,
  globalRateLimit,
  skipRateLimit,
  rateLimitHeaders,
};
