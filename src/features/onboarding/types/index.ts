import type { ImageProps } from "expo-image";
interface OnboardingSlide {
  key: string;
  title: string;
  description: string;
  image: ImageProps["source"];
}

interface OnboardingItemProps {
  item: OnboardingSlide;
  isDark: boolean;
}

export { OnboardingItemProps, OnboardingSlide };
