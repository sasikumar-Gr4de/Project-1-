// Helper functions
export const isValidJSON = (str) => {
  if (typeof str !== "string") return false;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim().length === 0) ||
  (typeof value === "object" && Object.keys(value).length === 0);

export const isBase64 = (str) => {
  if (typeof str !== "string") return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

export const isLikelyEncrypted = (data) => {
  if (!data || typeof data !== "string") return false;

  // Check if it's base64 encoded
  if (!isBase64(data)) return false;

  // If it's base64 but not valid JSON when decoded, it's likely encrypted
  try {
    const decoded = atob(data);
    return !isValidJSON(decoded);
  } catch {
    return false;
  }
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text || typeof text !== "string") return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "N/A";
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
