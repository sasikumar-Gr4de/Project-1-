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
