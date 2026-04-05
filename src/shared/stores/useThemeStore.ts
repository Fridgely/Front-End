import AsyncStorage from "@react-native-async-storage/async-storage";
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
        set((state) => ({
          theme:
            state.theme === "light"
              ? "dark"
              : state.theme === "dark"
                ? "system"
                : "light",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
