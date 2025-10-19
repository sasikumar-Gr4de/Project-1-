import { format, formatDistance, formatRelative, parseISO } from "date-fns";

// Date formatting
export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return format(dateObj, formatStr);
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatDateTime = (date, formatStr = "MMM dd, yyyy HH:mm") => {
  return formatDate(date, formatStr);
};

const formatGameTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatTime = (date, formatStr = "HH:mm") => {
  return formatDate(date, formatStr);
};

export const formatRelativeTime = (date) => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return formatRelative(dateObj, new Date());
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatDistanceToNow = (date) => {
  if (!date) return "N/A";
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    return "Invalid Date";
  }
};

// Number formatting
export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return "N/A";

  const {
    decimals = 0,
    compact = false,
    prefix = "",
    suffix = "",
    locale = "en-US",
  } = options;

  try {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: compact ? "compact" : "standard",
    });

    return `${prefix}${formatter.format(number)}${suffix}`;
  } catch (error) {
    return number.toString();
  }
};

export const formatPercentage = (number, decimals = 1) => {
  if (number === null || number === undefined) return "N/A";
  return formatNumber(number * 100, { decimals, suffix: "%" });
};

export const formatCurrency = (amount, currency = "USD", decimals = 0) => {
  if (amount === null || amount === undefined) return "N/A";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch (error) {
    return formatNumber(amount, { decimals, prefix: "$" });
  }
};

// Football-specific formatting
export const formatMinutes = (minutes) => {
  if (minutes === null || minutes === undefined) return "N/A";
  return `${minutes}'`;
};

export const formatScore = (homeScore, awayScore) => {
  if (homeScore === null || awayScore === null) return "VS";
  return `${homeScore} - ${awayScore}`;
};

export const formatPlayerName = (player, includeNumber = false) => {
  if (!player) return "Unknown Player";

  let name = player.name || "Unknown Player";
  if (includeNumber && player.jersey_number) {
    name = `${player.jersey_number}. ${name}`;
  }
  return name;
};

export const formatPosition = (position) => {
  if (!position) return "N/A";

  const positionMap = {
    GK: "Goalkeeper",
    CB: "Center Back",
    LCB: "Left Center Back",
    RCB: "Right Center Back",
    LB: "Left Back",
    RB: "Right Back",
    LWB: "Left Wing Back",
    RWB: "Right Wing Back",
    CDM: "Defensive Midfielder",
    CM: "Central Midfielder",
    LCM: "Left Central Midfielder",
    RCM: "Right Central Midfielder",
    CAM: "Attacking Midfielder",
    LAM: "Left Attacking Midfielder",
    RAM: "Right Attacking Midfielder",
    LM: "Left Midfielder",
    RM: "Right Midfielder",
    LW: "Left Winger",
    RW: "Right Winger",
    CF: "Center Forward",
    ST: "Striker",
    LS: "Left Striker",
    RS: "Right Striker",
  };

  return positionMap[position] || position;
};

// File size formatting
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Duration formatting
export const formatDuration = (seconds) => {
  if (!seconds) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Distance formatting (meters to appropriate unit)
// export const formatDistance = (meters, unit = "auto") => {
//   if (meters === null || meters === undefined) return "N/A";

//   if (unit === "auto") {
//     return meters >= 1000
//       ? `${(meters / 1000).toFixed(1)} km`
//       : `${Math.round(meters)} m`;
//   }

//   if (unit === "km") {
//     return `${(meters / 1000).toFixed(2)} km`;
//   }

//   return `${Math.round(meters)} m`;
// };

// Speed formatting
export const formatSpeed = (metersPerSecond, unit = "km/h") => {
  if (metersPerSecond === null || metersPerSecond === undefined) return "N/A";

  if (unit === "km/h") {
    return `${(metersPerSecond * 3.6).toFixed(1)} km/h`;
  }

  return `${metersPerSecond.toFixed(1)} m/s`;
};

// Age formatting
export const formatAge = (birthDate) => {
  if (!birthDate) return "N/A";

  try {
    const birth =
      typeof birthDate === "string" ? parseISO(birthDate) : new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} years`;
  } catch (error) {
    return "N/A";
  }
};

// Truncate text
export const truncateText = (text, maxLength = 50, suffix = "...") => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

// Capitalize text
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "N/A";

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check if the number is valid
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  return phoneNumber;
};

// Format social media handles
export const formatSocialHandle = (handle, platform) => {
  if (!handle) return "N/A";

  const platformPrefixes = {
    twitter: "@",
    instagram: "@",
    facebook: "",
    linkedin: "",
  };

  const prefix = platformPrefixes[platform] || "";
  return `${prefix}${handle}`;
};

// Export all formatters
export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatDistanceToNow,
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatMinutes,
  formatScore,
  formatPlayerName,
  formatPosition,
  formatFileSize,
  formatDuration,
  formatDistance,
  formatSpeed,
  formatAge,
  truncateText,
  capitalize,
  formatPhoneNumber,
  formatSocialHandle,
};
