// utils/refreshToken.jsx
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      throw new Error("⛔ Refresh token not found in localStorage");
    }

    const response = await axios.post(
      `${BASE_URL}api/token/refresh/`,
      { refresh },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const newAccess = response?.data?.access;

    if (!newAccess) {
      throw new Error("⚠️ Access token missing in refresh response");
    }

    localStorage.setItem("access", newAccess);

    return newAccess;
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      console.warn("🔒 Refresh token expired or invalid, logging out...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    } else {
      console.error("❌ Token refresh error:", error.message || error);
    }

    return null;
  }
};
