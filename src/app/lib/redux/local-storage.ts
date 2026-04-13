import type { RootState } from "lib/redux/store";
import CryptoJS from "crypto-js";

/**
 * Note: Encryption with a hardcoded key in client-side code provides no real security
 * against an attacker with access to the browser. We've removed encryption for new
 * data to avoid a false sense of security, but we keep the decryption logic as a 
 * fallback for existing users' data.
 */

const LOCAL_STORAGE_KEY = "open-resume-state";
const ENCRYPTION_KEY = "open-resume-security-key";

export const loadStateFromLocalStorage = () => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedState) return undefined;

    // If it's already a JSON string (new format), parse it directly
    if (storedState.startsWith("{")) {
      return JSON.parse(storedState);
    }

    // Fallback: Try to decrypt legacy encrypted data
    try {
      const bytes = CryptoJS.AES.decrypt(storedState, ENCRYPTION_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedData) {
        return JSON.parse(decryptedData);
      }
    } catch (e) {
      // If decryption fails, it might be invalid or not encrypted
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    // We now save as plain JSON string since localStorage is already origin-isolated
    const stringifiedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, stringifiedState);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());