import type { RootState } from "lib/redux/store";
import CryptoJS from "crypto-js";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LOCAL_STORAGE_KEY = "open-resume-state";
const ENCRYPTION_KEY = "open-resume-security-key";

export const loadStateFromLocalStorage = () => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedState) return undefined;

    // Fallback for legacy unencrypted data
    if (storedState.startsWith("{")) {
      return JSON.parse(storedState);
    }

    // Try to decrypt the state
    try {
      const bytes = CryptoJS.AES.decrypt(storedState, ENCRYPTION_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedData) {
        return JSON.parse(decryptedData);
      }
    } catch (e) {
      // If decryption fails, ignore and return undefined
    }

    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const saveStateToLocalStorage = (state: RootState) => {
  try {
    const stringifiedState = JSON.stringify(state);
    const encryptedState = CryptoJS.AES.encrypt(
      stringifiedState,
      ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(LOCAL_STORAGE_KEY, encryptedState);
  } catch (e) {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());
