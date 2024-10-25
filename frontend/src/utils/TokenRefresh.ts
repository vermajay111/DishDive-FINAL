import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setCookieByMinutes } from "./cookieManager";
import Cookies from "js-cookie";

const minutes = 2;
const REFRESH_TOKEN_EXPIRATION_BUFFER = minutes * 60 * 1000;

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const expirationTime = decoded.exp * 1000;
      if (expirationTime - Date.now() < REFRESH_TOKEN_EXPIRATION_BUFFER) {
        try {
          const newAccessToken = await refreshTokenRequest(refreshToken);
          setCookieByMinutes("access", newAccessToken, 5);
          config.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log(config)
          return config;
        } catch (error) {
          console.error("Refresh token error:", error);
          return Promise.reject(error);
        }
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else if (refreshToken && !accessToken) {
      try {
        const newAccessToken = await refreshTokenRequest(refreshToken);
        setCookieByMinutes("access", newAccessToken, 5);
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log(config)
        return config;
      } catch (error) {
        console.error("Refresh token error:", error);
        return Promise.reject(error);
      }
    }
    console.log(config)
    return config;
  },
  (error) => Promise.reject(error)
);

async function refreshTokenRequest(refreshToken: any) {
  const data = {
    refresh: refreshToken,
  };
  const response = await axios.post(
    "http://127.0.0.1:8000/users/refresh",
    data
  );
  return response.data.access;
}
