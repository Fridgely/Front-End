import AnimatedSplashScreen from "@/components/AnimatedSplashScreen";
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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";
import config from "../tamagui.config";

if (__DEV__) {
  require("../ReactotronConfig");
}

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const colorScheme = useColorScheme();

  const isLoggedIn = useIsLoggedIn();
  const isLoaded = useIsAuthLoaded();
  const { hydrate } = useAuthActions();
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    hydrate();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return null;
  }

  if (!animationFinished) {
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
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
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
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
