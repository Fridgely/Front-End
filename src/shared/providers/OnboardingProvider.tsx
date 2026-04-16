import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { getOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const isLoggedIn = useIsLoggedIn();

  const [isReady, setIsReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOnboardingCompleted()
      .then((completed) => {
        if (!mounted) return;
        setIsCompleted(completed);
        setIsReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setIsCompleted(false);
        setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const currentRootSegment = String(segments?.[0] ?? "");
    const inOnboarding = currentRootSegment === "onboarding";

    if (!isCompleted && !inOnboarding) {
      router.replace("/onboarding" as any);
      return;
    }

    if (isCompleted && inOnboarding) {
      if (isLoggedIn) router.replace("/(tabs)");
      else router.replace("/(auth)/login");
      return;
    }
  }, [isReady, isCompleted, isLoggedIn, router, segments]);

  return null;
}
