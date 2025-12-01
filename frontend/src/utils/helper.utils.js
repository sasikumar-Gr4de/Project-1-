import { SCORE_PILLARS } from "./constants";

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get badge variant based on status
 */
export const getBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "completed":
    case "approved":
    case "verified":
      return "default";
    case "inactive":
    case "pending":
    case "draft":
      return "secondary";
    case "injured":
    case "rejected":
    case "cancelled":
    case "banned":
    case "failed":
      return "destructive";
    case "processing":
      return "outline";
    default:
      return "outline";
  }
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
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

/**
 * Get color for score
 */
export const getScoreColor = (score) => {
  if (score >= 90) return "text-green-500";
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-yellow-400";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

/**
 * Get pillar color
 */
export const getPillarColor = (pillar) => {
  const colors = {
    [SCORE_PILLARS.TECHNICAL]: "text-blue-500",
    [SCORE_PILLARS.TACTICAL]: "text-purple-500",
    [SCORE_PILLARS.PHYSICAL]: "text-green-500",
    [SCORE_PILLARS.MENTAL]: "text-orange-500",
  };
  return colors[pillar] || "text-gray-500";
};

/**
 * Generate random color for charts
 */
export const generateColor = (index) => {
  const colors = [
    "#C1FF72",
    "#9ae619",
    "#7bb914",
    "#5d8c0f",
    "#adff45",
    "#d4ff9e",
    "#e8ffcc",
    "#f7ffed",
  ];
  return colors[index % colors.length];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

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
