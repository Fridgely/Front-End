import {
  useAuthStore,
  useIsAuthLoaded,
  useIsLoggedIn,
} from "@/features/auth/store/useAuthStore";
import { setIsLoggedInGetter } from "@/shared/apis/apiClient";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFcmTokenSync } from "../hooks/useFcmTokenSync";
import { useNotificationHandler } from "../hooks/useNotificationHandler";
import { getSubFromToken } from "../lib/decodeJwt";
import { useFcmSync } from "../lib/fcm/useFcmSync";

export function SessionProvider() {
  const isLoaded = useIsAuthLoaded();
  const isLoggedIn = useIsLoggedIn();
  const segments = useSegments();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const stableUserId = getSubFromToken(accessToken);
  const { syncFcmToken } = useFcmTokenSync();

  useFcmSync(isLoggedIn ? stableUserId : null, syncFcmToken);
  useNotificationHandler(isLoggedIn);

  // 불필요한 토큰 재발급 방지를 위해apiClient에 로그인 상태 제공 -
  useEffect(() => {
    setIsLoggedInGetter(() => isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments?.[0] === "(auth)";
    const inOnboarding = String(segments?.[0] ?? "") === "onboarding";

    if (!isLoggedIn && !inAuthGroup && !inOnboarding) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, isLoaded, segments, router]);

  return null;
}
