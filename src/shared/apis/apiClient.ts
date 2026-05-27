import { tokenStorage } from "@/shared/lib/tokenStorage/tokenStorage";
import axios from "axios";

// 로그인 상태를 받아옴
let getIsLoggedIn: (() => boolean) | null = null;

export const setIsLoggedInGetter = (fn: () => boolean) => {
  getIsLoggedIn = fn;
};

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // config가 없거나 response가 없는 경우 그냥 reject
    if (!originalConfig || !error.response) {
      return Promise.reject(error);
    }

    // 재발급 URL인 경우 재발급 시도 안함(무한 루프 방지)
    if (originalConfig.url?.includes("/api/v1/auth/reissue")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalConfig._retry) {
      // 로그인되지 않은 상태면 재발급 시도 안함
      const isLoggedIn = getIsLoggedIn?.() ?? false;
      if (!isLoggedIn) {
        return Promise.reject(error);
      }

      originalConfig._retry = true;
      try {
        const refreshToken = await tokenStorage.getRefreshToken();

        const reissueUrl =
          process.env.EXPO_PUBLIC_API_URL + "/api/v1/auth/reissue";

        const { data } = await axios.post(reissueUrl, {
          refreshToken,
        });

        const newAccess = data?.data?.accessToken ?? data?.accessToken;
        const newRefresh = data?.data?.refreshToken ?? data?.refreshToken;

        if (!newAccess || !newRefresh) {
          throw new Error(
            "Invalid reissue response: missing access/refresh token",
          );
        }

        await tokenStorage.setAccessToken(newAccess);
        await tokenStorage.setRefreshToken(newRefresh);

        originalConfig.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient.request(originalConfig);
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
        await tokenStorage.clear();
      }
    } else if (error.response && error.response.status === 401) {
      await tokenStorage.clear();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
