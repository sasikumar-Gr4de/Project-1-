import { isEmpty } from "./helper.utils";

export const validatePlayerInput = (formData) => {
  const {
    full_name,
    date_of_birth,
    position,
    preferred_foot,
    current_club,
    status,
    jersey_number,
  } = formData;
  let message = null;

  // Required field validations using isEmpty function
  if (isEmpty(full_name)) {
    message = "Full name is required";
    return { isValid: false, message };
  }

  if (isEmpty(date_of_birth)) {
    message = "Date of birth is required";
    return { isValid: false, message };
  }

  if (isEmpty(position)) {
    message = "Position is required";
    return { isValid: false, message };
  }

  if (isEmpty(preferred_foot)) {
    message = "Preferred foot is required";
    return { isValid: false, message };
  }

  if (isEmpty(current_club)) {
    message = "Current club is required";
    return { isValid: false, message };
  }

  if (isEmpty(status)) {
    message = "Status is required";
    return { isValid: false, message };
  }

  if (isEmpty(jersey_number)) {
    message = "Jersey number is required";
    return { isValid: false, message };
  }

  // All validations passed
  return { isValid: true, message: null };
};

export const validateClubInput = (formData) => {
  const { club_name } = formData;

  let message = null;

  if (isEmpty(club_name)) {
    message = "Club name is required";
    return { isValid: false, message };
  }

  if (club_name && club_name.trim().length < 2) {
    message = "Club name must be at least 2 characters long";
    return { isValid: false, message };
  }

  if (club_name && club_name.trim().length > 100) {
    message = "Club name must be less than 100 characters";
    return { isValid: false, message };
  }

  return { isValid: true, message: null };
};

export const validateMatchInput = (formData) => {
  const { home_club_id, away_club_id, match_date, venue } = formData;
  let message = null;

  // Required field validations using isEmpty function
  if (isEmpty(home_club_id)) {
    message = "Home club is required";
    return { isValid: false, message };
  }

  if (isEmpty(away_club_id)) {
    message = "Away club is required";
    return { isValid: false, message };
  }

  if (isEmpty(match_date)) {
    message = "Match date is required";
    return { isValid: false, message };
  }

  if (isEmpty(venue)) {
    message = "Venue is required";
    return { isValid: false, message };
  }

  // Additional validation: Home and away clubs cannot be the same
  if (home_club_id === away_club_id) {
    message = "Home club and away club cannot be the same";
    return { isValid: false, message };
  }

  // if (new Date(match_date) < new Date()) {
  //   message = "Match date cannot be in the past";
  //   return { isValid: false, message };
  // }

  // All validations passed
  return { isValid: true, message: null };
};
