import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { setOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { SLIDES } from "../constants/slides";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function useOnboarding() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const completeAndGoNext = useCallback(async () => {
    await setOnboardingCompleted(true);
    if (isLoggedIn) router.replace("/(tabs)");
    else router.replace("/(auth)/login");
  }, [isLoggedIn, router]);

  const handleNext = useCallback(() => {
    const next = Math.min(index + 1, SLIDES.length - 1);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  }, [index]);

  const onScrollEnd = useCallback((e: any) => {
    const nextIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setIndex(nextIndex);
  }, []);

  return {
    index,
    listRef,
    handleNext,
    onScrollEnd,
    completeAndGoNext,
    isLastSlide: index === SLIDES.length - 1,
  };
}
