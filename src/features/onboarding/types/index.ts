interface OnboardingSlide {
  key: string;
  title: string;
  description: string;
  image: any;
}

interface OnboardingItemProps {
  item: OnboardingSlide;
  isDark: boolean;
}

export { OnboardingItemProps, OnboardingSlide };
