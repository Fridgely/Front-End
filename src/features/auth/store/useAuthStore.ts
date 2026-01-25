import { tokenStorage } from "@/shared/lib/tokenStorage/tokenStorage";
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
        setTokens: async (res: LoginResponse) => {
          const authData = res.data;
          try {
            await tokenStorage.setAccessToken(authData.accessToken.toString());
            await tokenStorage.setRefreshToken(
              authData.refreshToken.toString(),
            );
            set({
              accessToken: authData.accessToken,
              isLoggedIn: true,
              isLoaded: true,
            });
          } catch (error) {
            set({ ...initialState, isLoaded: true });
            throw error;
          }
        },
        hydrate: async () => {
          try {
            const token = await tokenStorage.getAccessToken();
            set({
              accessToken: token,
              isLoggedIn: !!token,
              isLoaded: true,
            });
          } catch (error) {
            set({ ...initialState, isLoaded: true });
            throw error;
          }
        },
        logout: async () => {
          try {
            await tokenStorage.clear();
          } finally {
            set({ ...initialState, isLoaded: true });
          }
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
