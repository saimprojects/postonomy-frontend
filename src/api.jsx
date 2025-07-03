import axios from "axios";
import { refreshToken } from "./utils/refreshToken";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  
});

//  List of endpoints that do NOT require auth
const noAuthRequiredEndpoints = [
  "/login/",
  "/register/",
  "/verify-email/",
  "/send-password-reset-code/",
  "/verify-reset-code/",
  "/postsapi/send-otp/",
  "/postsapi/verify-otp/",
];

// Request Interceptor: Attach access token conditionally
API.interceptors.request.use(
  (config) => {
    const requiresAuth = !noAuthRequiredEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    const token = localStorage.getItem("access");

    if (requiresAuth && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
        // Add debugging logs here

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-refresh token on 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const newAccess = await refreshToken();
        if (newAccess) {
          //  Retry original request with new token
          localStorage.setItem("access", newAccess);
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return API(originalRequest);
        }
      } catch (err) {
        console.error("🔁 Token refresh failed:", err);
        // Optional: toast.error("Session expired. Please login again.");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
