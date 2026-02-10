export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "my_secret_key";
const STORAGE_KEY = "app_cache";
// XOR Encryption
export const xorEncrypt = (text, key) => {
  let encrypted = "";
  for (let i = 0; i < text.length; i++) {
    encrypted += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(encrypted); // Encode in Base64
};

// XOR Decryption
export const xorDecrypt = (encryptedText, key) => {
  let decoded = atob(encryptedText); // Decode Base64
  let decrypted = "";
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(
      decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return decrypted;
};

// Save multiple values in a single encrypted object
export const saveToStorage = (data) => {
  try {
    const existingData = getFromStorage() || {}; // Retrieve existing data
    const newData = { ...existingData, ...data }; // Merge new data
    const encryptedData = xorEncrypt(JSON.stringify(newData), SECRET_KEY);
    localStorage.setItem(STORAGE_KEY, encryptedData); // Store under a hidden key
  } catch (error) {
    alert("Error encrypting data:", error);
  }
};

// Retrieve and decrypt stored data
export const getFromStorage = () => {
  try {
    const encryptedData = localStorage.getItem(STORAGE_KEY);
    if (!encryptedData) return null;

    const decryptedData = xorDecrypt(encryptedData, SECRET_KEY);
    return JSON.parse(decryptedData);
  } catch (error) {
    alert("Error decrypting data:", error);
    return null;
  }
};

// Remove the entire encrypted object from storage
export const removeFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

import { useNavigate, useLocation } from 'react-router-dom'
import ADMIN_ROUTES from '../../routes/ADMIN_ROUTES'
import { jwtDecode } from 'jwt-decode'

export const getTokenFromStorage = () => {
  const location = useLocation()

  const currentPath = location.pathname
  const token = getFromStorage();
  const navigate = useNavigate()

  if (!token) {
    removeFromStorage()
    if (currentPath !== ADMIN_ROUTES.LOGIN || currentPath !== '/') navigate(ADMIN_ROUTES.LOGIN)
    return
  }
  const decoded = jwtDecode(token?.refreshToken);
  return decoded;
}





