import { CLIENT_TYPES, ROLE_TYPES } from "../utils/constants.js";
import { generateValidationResult } from "../utils/helpers.js";

export const RegisterInputValidation = (userInput) => {
  // Required Fields Test
  const { email, password, full_name, client_type, role } = userInput;
  let message = null;
  if (!email || !password || !full_name) {
    message = "Email, password, and full name are required";
  }

  if (
    !CLIENT_TYPES.EXTERNAL.includes(client_type) &&
    CLIENT_TYPES.INTERNAL.includes(client_type)
  )
    message = "Client type is not valid";

  if (!ROLE_TYPES.includes(role)) message = "Client role is not valid";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    message = "Please provide a valid email address";
  }

  if (password.length < 6) {
    message = "Password must be at least 6 characters long";
  }

  return generateValidationResult(message);
};

export const LoginInputValidation = (userInput) => {
  const { email, password } = userInput;

  let message = null;
  if (!email || !password) {
    message = "Email and password are required";
  }

  return generateValidationResult(message);
};
