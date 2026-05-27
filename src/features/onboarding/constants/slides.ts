import { OnboardingSlide } from "../types";

export const SLIDES: OnboardingSlide[] = [
  {
    key: "fresh",
    title: "신선함을 한눈에,\n낭비 없는 식생활",
    description: "유통기한 관리부터 멤버 초대까지\nFridgely와 함께하세요.",
    image: require("../../../../assets/images/onboarding/onboarding_1.webp"),
  },
  {
    key: "smart",
    title: "버려지는 음식 없이\n똑똑하게",
    description: "유통기한 임박 알림을 받고\n식재료 낭비를 줄여보세요.",
    image: require("../../../../assets/images/onboarding/onboarding_2.webp"),
  },
];
