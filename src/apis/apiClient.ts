import { tokenStorage } from "@/lib/tokenStorage/tokenStorage";
import axios from "axios";

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
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // 재발급 URL인 경우 재발급 시도 안함(무한 루프 방지)
    if (originalConfig.url?.includes("/api/v1/auth/reissue")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const accessToken = await tokenStorage.getAccessToken();
        const refreshToken = await tokenStorage.getRefreshToken();

        const reissueUrl =
          process.env.EXPO_PUBLIC_API_URL + "/api/v1/auth/reissue";

        const { data } = await axios.post(reissueUrl, {
          accessToken,
          refreshToken,
        });

        await tokenStorage.setAccessToken(data.accessToken);
        await tokenStorage.setRefreshToken(data.refreshToken);

        originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient.request(originalConfig);
      } catch (reissueError) {
        console.error("토큰 재발급 실패:", reissueError);
        await tokenStorage.clear();
      }
    } else if (error.response && error.response.status === 401) {
      await tokenStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
