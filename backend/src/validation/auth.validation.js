import { generateValidationResult } from "../utils/helpers";

export const RegisterInputValidation = (userInput) => {
  // Required Fields Test
  const { email, password, full_name } = userInput;
  let message = null;
  if (!email || !password || !full_name) {
    message = "Email, password, and full name are required";
  }

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
