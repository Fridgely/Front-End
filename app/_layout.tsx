import { toastConfig } from "@/components/ui/ToastConfig";
import {
  useAuthActions,
  useIsAuthLoaded,
  useIsLoggedIn,
} from "@/features/auth/store/useAuthStore";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { queryClient } from "@/lib/queryClient";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Spinner, TamaguiProvider, View } from "tamagui";
import config from "../tamagui.config";

if (__DEV__) {
  require("../ReactotronConfig");
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const colorScheme = useColorScheme();

  const isLoggedIn = useIsLoggedIn();
  const isLoaded = useIsAuthLoaded();
  const { hydrate } = useAuthActions();

  // 앱 시작시 토큰 정보 불러오기(자동 로그인)
  useEffect(() => {
    hydrate();
  }, []);

  if (!isLoaded) {
    return (
      <TamaguiProvider config={config}>
        <View f={1} ai="center" jc="center" bg="$background">
          <Spinner size="large" color="$primary" />
        </View>
      </TamaguiProvider>
    );
  }

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
