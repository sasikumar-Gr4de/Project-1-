import CryptoJS from "crypto-js";

import {
  isValidJSON,
  isBase64,
  isLikelyEncrypted,
} from "@/utils/helper.utils.js";

// Get encryption key from environment variables with fallback
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Helper functions
const isValidJSON = (str) => {
  if (typeof str !== "string") return false;
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

const isBase64 = (str) => {
  if (typeof str !== "string") return false;
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
};

const isLikelyEncrypted = (data) => {
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
          console.warn(`Failed to decrypt data for key: ${name}`);
          return null;
        }

        return JSON.parse(decryptedText);
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
      return null;
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
      // Fallback to regular localStorage
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (fallbackError) {
        console.error("Fallback storage also failed:", fallbackError);
      }
      return false;
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
    return localStorage.getItem(name) !== null;
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
