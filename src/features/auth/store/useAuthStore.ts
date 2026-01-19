import { tokenStorage } from "@/lib/tokenStorage/tokenStorage";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import type { LoginResponse } from "../api/auth.types";

type State = {
  isLoaded: boolean;
  accessToken: string | null;
  isLoggedIn: boolean;
};

const initialState: State = {
  isLoaded: false,
  accessToken: null,
  isLoggedIn: false,
};

const useAuthStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setTokens: async (data: LoginResponse) => {
          const authData = data.data;
          await tokenStorage.setAccessToken(authData.accessToken.toString());
          await tokenStorage.setRefreshToken(authData.refreshToken.toString());
          set({
            accessToken: authData.accessToken,
            isLoggedIn: true,
            isLoaded: true,
          });
        },
        hydrate: async () => {
          const token = await tokenStorage.getAccessToken();
          set({
            accessToken: token,
            isLoggedIn: !!token,
            isLoaded: true,
          });
        },
        logout: async () => {
          await tokenStorage.clear();
          set({ ...initialState, isLoaded: true });
        },
      },
    })),
    { name: "authStore" },
  ),
);

const useIsLoggedIn = () => useAuthStore((state) => state.isLoggedIn);
const useIsAuthLoaded = () => useAuthStore((state) => state.isLoaded);
const useAuthActions = () => useAuthStore((state) => state.actions);

export { useAuthActions, useAuthStore, useIsAuthLoaded, useIsLoggedIn };
