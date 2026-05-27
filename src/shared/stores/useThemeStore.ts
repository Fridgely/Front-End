import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AppTheme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const resolveTheme = (
  theme: AppTheme,
  systemColorScheme: "light" | "dark" | null | undefined,
): ResolvedTheme => {
  if (theme === "system") {
    return systemColorScheme === "dark" ? "dark" : "light";
  }

  return theme;
};

interface ThemeStore {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme: AppTheme) => set({ theme }),
      toggleTheme: () =>
        set((state) => {
          // 시스템 인 경우에도 토글은 라이트, 다크로만 전환
          const systemColorScheme = Appearance.getColorScheme();
          const resolvedTheme = resolveTheme(state.theme, systemColorScheme);
          const nextTheme: AppTheme =
            resolvedTheme === "dark" ? "light" : "dark";
          return { theme: nextTheme };
        }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
