import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { getOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const isLoggedIn = useIsLoggedIn();

  // 완료 여부는 스토리지 기준으로 매번 조회
  useEffect(() => {
    let cancelled = false;

    (async () => {
      let completed = false;
      try {
        completed = await getOnboardingCompleted();
      } catch {
        completed = false;
      }
      if (cancelled) return;

      const currentRootSegment = String(segments?.[0] ?? "");
      const inOnboarding = currentRootSegment === "onboarding";

      if (!completed && !inOnboarding) {
        router.replace("/onboarding" as any);
        return;
      }

      if (completed && inOnboarding) {
        if (isLoggedIn) router.replace("/(tabs)");
        else router.replace("/(auth)/login");
        return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, router, segments]);

  return null;
}
