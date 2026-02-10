import { getFromStorage, saveToStorage } from "./storageHelper";

export const accessStore = {
  async get() {
    return getFromStorage().accessToken;
  },
  async set(v) {
    saveToStorage({accessToken: v});
  },
};

export const refreshStore = {
  key: "refreshToken",
  async get() {
    return getFromStorage().refreshToken;
  },
  async set(v) {
    saveToStorage({refreshToken: v});
  },
};
