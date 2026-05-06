import { getOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useSegments } from "expo-router";
import { useEffect, useRef } from "react";

const STORAGE_KEY = "notification_permission_prompted";

export function NotificationPermissionGate({ enabled }: { enabled: boolean }) {
  const segments = useSegments();
  const sessionCheckedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const currentRootSegment = String(segments?.[0] ?? "");
    const inOnboarding = currentRootSegment === "onboarding";
    if (inOnboarding) return;
    if (sessionCheckedRef.current) return;
    sessionCheckedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const completed = await getOnboardingCompleted();
        if (!completed) return;

        const prompted = await AsyncStorage.getItem(STORAGE_KEY);
        if (prompted === "1") return;

        const perm = await Notifications.getPermissionsAsync();
        if (perm.granted) {
          await AsyncStorage.setItem(STORAGE_KEY, "1");
          return;
        }

        if (cancelled) return;

        if (perm.canAskAgain === false) {
          await AsyncStorage.setItem(STORAGE_KEY, "1");
          return;
        }

        await Notifications.requestPermissionsAsync();
        await AsyncStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // 실패 시에는 사용자 경험을 위해 조용히 스킵
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, segments]);

  return null;
}
