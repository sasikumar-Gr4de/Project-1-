import CryptoJS from "crypto-js";

const isLikelyEncrypted = (data) => {
  if (typeof data !== "string") return false;

  // Check if it's a valid Base64 string (common for encrypted data)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  const isBase64 = base64Regex.test(data) && data.length % 4 === 0;

  // Check if it's NOT parseable as JSON (encrypted data usually isn't)
  let isJson = false;
  try {
    JSON.parse(data);
    isJson = true;
  } catch (e) {
    // Not JSON - more likely to be encrypted
  }

  // More likely encrypted if it's Base64 and not JSON
  return isBase64 && !isJson;
};

// Get encryption key from environment variables with fallback
const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "fallback-secure-key-2024";

// Validate encryption key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY === "fallback-secure-key-2024") {
  console.warn(
    "VITE_ENCRYPTION_KEY is not set. Using fallback key for development."
  );
}

// Main encrypted storage implementation
export const encryptedStorage = {
  // Get item with automatic decryption
  getItem: (name) => {
    try {
      const item = localStorage.getItem(name);

      if (item === null) return null;

      // Check if data is encrypted
      if (isLikelyEncrypted(item)) {
        const bytes = CryptoJS.AES.decrypt(item, ENCRYPTION_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedText) {
          console.warn(
            `Failed to decrypt data for key: ${name}. Data may be corrupted or using different key.`
          );

          // Try to parse as plain JSON as fallback
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }

        try {
          return JSON.parse(decryptedText);
        } catch (parseError) {
          // If it's not JSON, return as string
          return decryptedText;
        }
      } else {
        // Data is not encrypted - try to parse as JSON
        try {
          return JSON.parse(item);
        } catch {
          // If it's not JSON, return as string
          return item;
        }
      }
    } catch (error) {
      console.error(`Error getting encrypted item ${name}:`, error);

      // Final fallback - return raw item
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    }
  },

  // Set item with encryption
  setItem: (name, value) => {
    try {
      let dataToStore;

      // Handle different data types
      if (typeof value === "string") {
        dataToStore = value;
      } else if (typeof value === "number" || typeof value === "boolean") {
        dataToStore = value.toString();
      } else {
        dataToStore = JSON.stringify(value);
      }

      const encrypted = CryptoJS.AES.encrypt(
        dataToStore,
        ENCRYPTION_KEY
      ).toString();
      localStorage.setItem(name, encrypted);
      return true;
    } catch (error) {
      console.error(`Error setting encrypted item ${name}:`, error);
      // Fallback to regular localStorage without encryption
      try {
        localStorage.setItem(name, JSON.stringify(value));
        return true;
      } catch (fallbackError) {
        console.error("Fallback storage also failed:", fallbackError);
        return false;
      }
    }
  },

  // Remove item
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      return true;
    } catch (error) {
      console.error(`Error removing item ${name}:`, error);
      return false;
    }
  },

  // Clear all encrypted items (optional pattern matching)
  clear: (pattern = null) => {
    try {
      if (pattern) {
        // Clear only items matching pattern
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes(pattern)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));
        return keysToRemove.length;
      } else {
        // Clear entire localStorage
        localStorage.clear();
        return true;
      }
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  },

  // Get all keys (optional)
  keys: () => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    } catch (error) {
      console.error("Error getting storage keys:", error);
      return [];
    }
  },

  // Check if key exists
  hasItem: (name) => {
    try {
      return localStorage.getItem(name) !== null;
    } catch (error) {
      console.error(`Error checking item ${name}:`, error);
      return false;
    }
  },

  // Get storage usage info
  getStorageInfo: () => {
    try {
      let totalSize = 0;
      const items = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        totalSize += size;
        items.push({ key, size });
      }

      return {
        totalItems: localStorage.length,
        totalSize,
        items: items.sort((a, b) => b.size - a.size),
      };
    } catch (error) {
      console.error("Error getting storage info:", error);
      return null;
    }
  },
};

// Zustand persist storage adapter
export const zustandEncryptedStorage = {
  getItem: (name) => {
    return encryptedStorage.getItem(name);
  },
  setItem: (name, value) => {
    return encryptedStorage.setItem(name, value);
  },
  removeItem: (name) => {
    return encryptedStorage.removeItem(name);
  },
};

// React hook for encrypted storage
export const useEncryptedStorage = () => {
  return {
    get: encryptedStorage.getItem,
    set: encryptedStorage.setItem,
    remove: encryptedStorage.removeItem,
    clear: encryptedStorage.clear,
    has: encryptedStorage.hasItem,
    keys: encryptedStorage.keys,
  };
};

export { isLikelyEncrypted };
