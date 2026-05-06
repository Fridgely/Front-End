import { getOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useSegments } from "expo-router";
import { useEffect, useRef } from "react";

// 키를 바꾸면 기존 사용자에게 다시 노출될 수 있어 versioned key 유지
const STORAGE_KEY = "notification_permission_prompted_v1";

export function NotificationPermissionGate({ enabled }: { enabled: boolean }) {
  const segments = useSegments();
  const sessionCheckedRef = useRef(false);
  const sessionRunningRef = useRef(false); //동시 실행 방지용

  useEffect(() => {
    if (!enabled) return;
    const currentRootSegment = String(segments?.[0] ?? "");
    const inOnboarding = currentRootSegment === "onboarding";
    if (inOnboarding) return;
    if (sessionCheckedRef.current) return;
    if (sessionRunningRef.current) return; //이미 진행중이면 스킵
    sessionRunningRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const completed = await getOnboardingCompleted();
        if (cancelled) return;
        if (!completed) return;

        const prompted = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (prompted === "1") return;

        const perm = await Notifications.getPermissionsAsync();
        if (cancelled) return;
        if (perm.granted) {
          await AsyncStorage.setItem(STORAGE_KEY, "1");
          return;
        }

        if (perm.canAskAgain === false) {
          await AsyncStorage.setItem(STORAGE_KEY, "1");
          return;
        }

        await Notifications.requestPermissionsAsync();
        await AsyncStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // 실패 시에는 사용자 경험을 위해 조용히 스킵
      } finally {
        sessionCheckedRef.current = true;
        sessionRunningRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, segments]);

  return null;
}
