import { toastConfig } from "@/components/ui/ToastConfig";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/queryClient";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const colorScheme = useColorScheme();
  // TODO 나중에 zustand로 교체 예정
  const isLoggedIn = false;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === "dark" ? "dark" : "light"}
        >
          <Stack screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <Stack.Screen name="(auth)" />
            ) : (
              <Stack.Screen name="(tabs)" />
            )}
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
          <Toast config={toastConfig} />
        </TamaguiProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
