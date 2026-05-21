import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { useColorScheme } from "react-native";

export function useResolvedTheme() {
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const resolvedTheme = resolveTheme(theme, systemColorScheme);

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === "dark",
  };
}
