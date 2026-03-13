import {
  useAuthStore,
  useIsAuthLoaded,
  useIsLoggedIn,
} from "@/features/auth/store/useAuthStore";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useFcmTokenSync } from "../hooks/useFcmTokenSync";
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

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && (inAuthGroup || segments.length === 0)) {
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, isLoaded, segments]);

  return null;
}
