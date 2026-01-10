// src/lib/tokenStorage.ts
import * as SecureStore from "expo-secure-store";
import { TokenStorage } from "./tokenStorage.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenStorage: TokenStorage = {
  // access token
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) =>
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),

  //   refresh token
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),

  // clear
  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
