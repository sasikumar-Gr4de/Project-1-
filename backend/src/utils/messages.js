const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const AUTH_MESSAGES = {
  // Success messages
  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
  LOGIN_SUCCESS: "Login successful",
  TOKEN_VALID: "Token is valid",

  // Error messages
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_REQUIRED: "Access token required",
  OTP_REQUIRED: "OTP is required",
  EMAIL_PHONE_REQUIRED: "Email or phone number is required",
  INVALID_OTP: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  USER_EXISTS: "User already exists",
  USER_NOT_FOUND: "User not found",
  ACCOUNT_NOT_VERIFIED: "Account not verified",
  UNAUTHORIZED_ACCESS: "Unauthorized access",
  RATE_LIMIT_EXCEEDED: "Too many attempts, please try again later",
};

const USER_MESSAGES = {
  // Success messages
  PROFILE_FETCHED: "Profile fetched successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  USER_CREATED: "User created successfully",

  // Error messages
  PROFILE_NOT_FOUND: "Profile not found",
  EMAIL_EXISTS: "Email already exists",
  PHONE_EXISTS: "Phone number already exists",
  INVALID_EMAIL: "Invalid email format",
  INVALID_PHONE: "Invalid phone number format",
};

const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please provide a valid email",
  INVALID_PHONE: "Please provide a valid phone number",
  PASSWORD_TOO_WEAK:
    "Password must be at least 8 characters with uppercase, lowercase, and numbers",
  INVALID_INPUT: "Invalid input provided",
};

const SERVER_MESSAGES = {
  INTERNAL_ERROR: "Internal server error",
  SERVICE_UNAVAILABLE: "Service temporarily unavailable",
  DATABASE_ERROR: "Database operation failed",
};

const createResponse = (
  success,
  message,
  data = null,
  statusCode = HTTP_STATUS.SUCCESS
) => {
  return {
    success,
    message,
    data,
    statusCode,
  };
};

// Pre-built response objects
export const RESPONSES = {
  // Success responses
  SUCCESS: (message, data = null) => createResponse(true, message, data),
  CREATED: (message, data = null) =>
    createResponse(true, message, data, HTTP_STATUS.CREATED),

  // Error responses
  BAD_REQUEST: (message) =>
    createResponse(false, message, null, HTTP_STATUS.BAD_REQUEST),
  UNAUTHORIZED: (message) =>
    createResponse(false, message, null, HTTP_STATUS.UNAUTHORIZED),
  FORBIDDEN: (message) =>
    createResponse(false, message, null, HTTP_STATUS.FORBIDDEN),
  NOT_FOUND: (message) =>
    createResponse(false, message, null, HTTP_STATUS.NOT_FOUND),
  CONFLICT: (message) =>
    createResponse(false, message, null, HTTP_STATUS.CONFLICT),
  SERVER_ERROR: (message) =>
    createResponse(false, message, null, HTTP_STATUS.SERVER_ERROR),
};
