import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { TamaguiProvider } from "tamagui";

import AnimatedSplashScreen from "@/shared/components/AnimatedSplashScreen";
import { toastConfig } from "@/shared/components/ui/ToastConfig";
import { useAppHydration } from "@/shared/hooks/useAppHydration";
import { queryClient } from "@/shared/lib/queryClient";
import { SessionProvider } from "@/shared/providers/SessionProvider";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { useFonts } from "expo-font";
import config from "../tamagui.config";

import { useNotificationStore } from "@/features/notification/stores/useNotificationStore";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { GestureHandlerRootView } from "react-native-gesture-handler";

if (__DEV__) {
  require("../ReactotronConfig");
}
// 백그라운드일때
const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  try {
    if (remoteMessage.notification) {
      const targetScreen = remoteMessage.data?.target_screen;
      const state = useNotificationStore.getState();

      // 스토어가 정상적으로 로드된 경우에만 저장
      if (state && state.addNotification) {
        state.addNotification({
          title: remoteMessage.notification.title || "유통기한 임박",
          body: remoteMessage.notification.body || "",
          targetScreen:
            typeof targetScreen === "string" ? targetScreen : undefined,
          messageId: remoteMessage.messageId ?? undefined,
        });
      }
    }
  } catch (error) {
    console.error("Background Store Error:", error);
  }
});

export const unstable_settings = {
  anchor: "(tabs)",
};

SplashScreen.preventAutoHideAsync().catch(() => {});

let hasShownAnimatedSplash = false;

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  const { isHydrated, theme } = useAppHydration();
  const [animationFinished, setAnimationFinished] = useState(
    hasShownAnimatedSplash,
  );
  const [fontsLoaded, fontError] = useFonts({
    "GyeonggiBatang-Bold": require("../assets/fonts/GyeonggiBatang-Bold.otf"),
    "GyeonggiTitle-Bold": require("../assets/fonts/GyeonggiTitle-Bold.otf"),
    BMJUA: require("../assets/fonts/BMJUA.otf"),
  });

  const isAppReady = (isHydrated && fontsLoaded) || !!fontError;

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [isAppReady]);

  if (!isAppReady || !animationFinished) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <AnimatedSplashScreen
            onAnimationFinish={() => {
              hasShownAnimatedSplash = true;
              setAnimationFinished(true);
            }}
          />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <TamaguiProvider config={config} defaultTheme={theme}>
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
    </GestureHandlerRootView>
  );
}
