export const EMAIL_ALREADY_EXIST = "User alerady exists with this email";
export const INVALID_REFERENCE_ID = "Reference id is not valid";

export const SUPABASE_INVALID_CREDENTIALS = "Invalid login credentials";
export const INVALID_CREDENTIALS = "Invalid email or password";
export const DATABASE_CONNECTION_ERROR = "Datbase connection timeout";

export const SUPABASE_EMAIL_NOT_CONFIRMED = "Email not confirmed";
export const EMAIL_NOT_CONFIRMED =
  "Please verify your email address before logging in";

export const USER_NOT_FOUND = "User not found";
export const EMAIL_VERIFY_REQUIRED =
  "Success! Please verify your email so we can activate your account.";
export const LOGIN_SUCCESS = "Welcome back! You've successfully logged in.";
export const REGISTER_SUCCESS_INTERNAL =
  "Your account has been created and is awaiting activation by the admin.";
export const REGISTER_SUCCESS_EXTERNAL =
  "Registration successful. Welcome to our platform!";

// Auth middleware
export const NOT_AUTHORIZED_401 =
  "Not authorized to access this route. No token provided.";
export const INACTIVE_403 = "User account is inactive. Please contact support.";
export const TOKEN_VERFICATION_FAILED =
  "Token verification failed. Please log in again.";

export const LOGOUT_SUCCESS = "Logged out successfully";

// change password
export const CURRENT_PASSWORD_INCORRECT = "Current password is incorrect";
export const PASSWORD_UPDATE_SUCCESS = "Password updated successfully";
// verify-email
export const VERIFY_EMAIL_RESENT = " A verification email has been sent.";
export const VERIFY_STATUS_ERROR = "Error checking verifcation status";
export const ACCOUNT_DEACTIVE_ERROR =
  "Account is deactivated. Please contact support.";
export const VERIFY_STATUS_CHECK = "Check verfication status by email";

// Club messages
export const CLUB_CREATE_SUCCESS = "Club created successfully";
export const CLUB_GET_SUCCESS = "Club retrieved successfully";
export const CLUB_UPDATE_SUCCESS = "Club updated successfully";
export const CLUB_DELETE_SUCCESS = "Club deleted successfully";
export const CLUB_NOT_FOUND = "Club not found";
export const CLUB_PLAYERS_GET_SUCCESS = "Club players retrieved successfully";

// Match messages
export const MATCH_CREATE_SUCCESS = "Match created successfully";
export const MATCH_GET_SUCCESS = "Match retrieved successfully";
export const MATCH_UPDATE_SUCCESS = "Match updated successfully";
export const MATCH_DELETE_SUCCESS = "Match deleted successfully";
export const MATCH_NOT_FOUND = "Match not found";

// Player messages
export const PLAYER_CREATE_SUCCESS = "Player created successfully";
export const PLAYER_GET_SUCCESS = "Player retrieved successfully";
export const PLAYER_UPDATE_SUCCESS = "Player updated successfully";
export const PLAYER_DELETE_SUCCESS = "Player deleted successfully";
export const PLAYER_NOT_FOUND = "Player not found";
export const PLAYER_CLUB_GET_SUCCESS = "Player club retrieved successfully";

// Analysis Works Messages
export const ANALYSIS_WORK_CREATE_SUCCESS =
  "Analysis work created successfully";
export const ANALYSIS_WORK_GET_SUCCESS = "Analysis work retrieved successfully";
export const ANALYSIS_WORK_UPDATE_SUCCESS =
  "Analysis work updated successfully";
export const ANALYSIS_WORK_DELETE_SUCCESS =
  "Analysis work deleted successfully";
export const ANALYSIS_WORK_NOT_FOUND = "Analysis work not found";

// Events Temp Messages
export const EVENT_CREATE_SUCCESS = "Event created successfully";
export const EVENT_GET_SUCCESS = "Event retrieved successfully";
export const EVENT_UPDATE_SUCCESS = "Event updated successfully";
export const EVENT_DELETE_SUCCESS = "Event deleted successfully";
export const EVENT_NOT_FOUND = "Event not found";
export const EVENTS_BULK_CREATE_SUCCESS = "Events created successfully";

// Match Info Messages
export const MATCH_INFO_CREATE_SUCCESS = "Match info created successfully";
export const MATCH_INFO_GET_SUCCESS = "Match info retrieved successfully";
export const MATCH_INFO_UPDATE_SUCCESS = "Match info updated successfully";
export const MATCH_INFO_DELETE_SUCCESS = "Match info deleted successfully";
export const MATCH_INFO_NOT_FOUND = "Match info not found";

// Common Messages

export const COMMON_GET_SUCCESS = "Featched data successfully";
export const COMMON_UPDATE_SUCCESS = "Data is successfully updated";
export const COMMON_SERVER_ERROR = "Internal server error";
