import Http from "./clientDefinition";
import { accessStore } from "../tokenStore/localStorage";
import { refreshAccessToken } from "../auth/refresh";

export const axiosInstance = Http.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  tokenStore: accessStore, // reads/writes accessToken automatically
  refreshToken: refreshAccessToken, // called once on 401, then original request retries
  timeout: 30000,
  retry: {
    retries: 2,
    retryOn: [429, 502, 503, 504],
    baseDelay: 200,
    maxDelay: 1500,
  },
});
