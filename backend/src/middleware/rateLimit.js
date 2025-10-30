// import rateLimit from "express-rate-limit";

// // In-memory store configuration for /api routes
// const createRateLimiter = (options) => {
//   return rateLimit({
//     // Use built-in memory store (default)
//     store: new rateLimit.MemoryStore(),

//     handler: (req, res) => {
//       res.status(429).json({
//         success: false,
//         message: options.message,
//         retryAfter: Math.ceil(options.windowMs / 1000),
//         limit: options.max,
//         window: options.windowMs,
//         path: req.path,
//       });
//     },

//     onLimitReached: (req, res, options) => {
//       console.warn(`Rate limit reached for API route: ${req.path}`, {
//         ip: req.ip,
//         method: req.method,
//         user: req.user?.id || "anonymous",
//         identifier: options.keyGenerator ? options.keyGenerator(req) : req.ip,
//       });
//     },

//     standardHeaders: true,
//     legacyHeaders: false,
//     skipFailedRequests: false,
//     skipSuccessfulRequests: false,

//     ...options,
//   });
// };

// // Global API rate limiting (applies to all /api routes)
// export const globalApiRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // 500 requests per 15 minutes per IP
//   message: "Too many API requests. Please slow down.",
//   keyGenerator: (req) => `api:global:${req.ip}`,
// });

// // OTP-specific rate limiting for /api/auth routes
// export const otpRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 3, // 3 OTP attempts per 15 minutes
//   message:
//     "Too many OTP verification attempts. Please try again in 15 minutes.",
//   keyGenerator: (req) => {
//     const identifier = req.body.email || req.body.phone || req.ip;
//     return `api:otp:${identifier}`;
//   },
// });

// // Authentication rate limiting for /api/auth routes
// export const authRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // 10 login attempts per 15 minutes
//   message: "Too many authentication attempts. Please try again in 15 minutes.",
//   keyGenerator: (req) => {
//     const identifier = req.body.email || req.body.phone || req.ip;
//     return `api:auth:${identifier}`;
//   },
// });

// // File upload rate limiting for /api/upload routes
// export const uploadRateLimit = createRateLimiter({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5, // 5 uploads per hour
//   message: "Too many file uploads. Please try again in an hour.",
//   keyGenerator: (req) => `api:upload:${req.user?.id || req.ip}`,
// });

// // Password reset rate limiting
// export const passwordResetRateLimit = createRateLimiter({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3, // 3 password reset attempts per hour
//   message: "Too many password reset attempts. Please try again in an hour.",
//   keyGenerator: (req) => `api:pwd_reset:${req.body.email || req.ip}`,
// });

// // Admin API rate limiting for /api/admin routes
// export const adminRateLimit = createRateLimiter({
//   windowMs: 5 * 60 * 1000, // 5 minutes
//   max: 100, // 100 requests per 5 minutes for admin endpoints
//   message: "Too many admin API requests. Please slow down.",
//   keyGenerator: (req) => `api:admin:${req.user?.id || req.ip}`,
//   skip: (req) => !req.user || req.user.role !== "admin",
// });

// // Public API rate limiting (for unauthenticated endpoints)
// export const publicApiRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // 100 requests per 15 minutes for public endpoints
//   message: "Too many requests to public API. Please slow down.",
//   keyGenerator: (req) => `api:public:${req.ip}`,
// });

// // User-specific API rate limiting
// export const userApiRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // 200 requests per 15 minutes for authenticated users
//   message: "Too many API requests from your account. Please slow down.",
//   keyGenerator: (req) => `api:user:${req.user?.id || req.ip}`,
// });

// // Bruteforce protection for sensitive API endpoints
// export const bruteForceLimit = createRateLimiter({
//   windowMs: 60 * 1000, // 1 minute
//   max: 10, // 10 requests per minute
//   message: "Too many attempts on sensitive endpoint. Please wait a minute.",
//   keyGenerator: (req) => `api:bruteforce:${req.ip}`,
// });

// // Development API rate limiting (more lenient)
// export const developmentApiRateLimit = createRateLimiter({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // Very high limit for development
//   message: "Development API rate limit exceeded.",
//   skip: (req) => process.env.NODE_ENV === "production",
// });

// // Skip rate limiting for certain API routes
// export const skipApiRateLimit = (req) => {
//   const path = req.path;

//   // Skip rate limiting for API health checks
//   if (path === "/api/health" || path === "/api/status") return true;

//   // Skip for internal IPs in development
//   if (process.env.NODE_ENV !== "production") {
//     const internalIps = ["127.0.0.1", "::1", "10.", "192.168."];
//     if (internalIps.some((ip) => req.ip.startsWith(ip))) return true;
//   }

//   // Skip for trusted admin users in development
//   if (req.user?.role === "admin" && process.env.NODE_ENV !== "production") {
//     return true;
//   }

//   return false;
// };

// // Apply skip logic to all API rate limiters
// const applyApiSkipLogic = (limiter) => {
//   const originalSkip = limiter.skip;
//   limiter.skip = (req, res) => {
//     if (skipApiRateLimit(req)) return true;
//     if (originalSkip) return originalSkip(req, res);
//     return false;
//   };
//   return limiter;
// };

// // Export API rate limiters with skip logic applied
// export default {
//   globalApiRateLimit: applyApiSkipLogic(globalApiRateLimit),
//   otpRateLimit: applyApiSkipLogic(otpRateLimit),
//   authRateLimit: applyApiSkipLogic(authRateLimit),
//   uploadRateLimit: applyApiSkipLogic(uploadRateLimit),
//   passwordResetRateLimit: applyApiSkipLogic(passwordResetRateLimit),
//   adminRateLimit: applyApiSkipLogic(adminRateLimit),
//   publicApiRateLimit: applyApiSkipLogic(publicApiRateLimit),
//   userApiRateLimit: applyApiSkipLogic(userApiRateLimit),
//   bruteForceLimit: applyApiSkipLogic(bruteForceLimit),
//   developmentApiRateLimit: applyApiSkipLogic(developmentApiRateLimit),
//   skipApiRateLimit,
// };
