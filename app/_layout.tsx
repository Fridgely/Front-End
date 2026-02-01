import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { TamaguiProvider } from "tamagui";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

import {
  useAuthActions,
  useIsAuthLoaded,
  useIsLoggedIn,
} from "@/features/auth/store/useAuthStore";
import AnimatedSplashScreen from "@/shared/components/AnimatedSplashScreen";
import { toastConfig } from "@/shared/components/ui/ToastConfig";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { queryClient } from "@/shared/lib/queryClient";
import { SessionProvider } from "@/shared/providers/SessionProvider";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import config from "../tamagui.config";

if (__DEV__) {
  require("../ReactotronConfig");
}

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const isLoaded = useIsAuthLoaded();
  const { hydrate } = useAuthActions();
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoaded]);

  if (!isLoaded || !animationFinished) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AnimatedSplashScreen
          onAnimationFinish={() => setAnimationFinished(true)}
        />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          {/* 세션 관리 로직을 위해 스택 위에 배치 */}
          <SessionProvider />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
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
