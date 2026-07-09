import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECURE_STORAGE_KEY || 'default-secure-pasa-motor-key-2026';

export const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(key, encrypted);
    } catch (e) {
      console.error('Error encrypting local storage data', e);
    }
  },
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      // If the data was stored previously without encryption, it might not decrypt correctly
      // We check if it looks like a valid AES string (starts with U2FsdGVkX1)
      if (!encrypted.startsWith('U2FsdGVkX1')) {
         // Clear the unencrypted data for security
         localStorage.removeItem(key);
         return null;
      }
      
      const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      const originalValue = decrypted.toString(CryptoJS.enc.Utf8);
      return originalValue || null;
    } catch (e) {
      console.error('Error decrypting local storage data', e);
      return null;
    }
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
  }
};
