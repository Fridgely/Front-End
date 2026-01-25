import { createTokens } from "tamagui";

/**
 * 앱 전반에서 사용하는 디자인 토큰들을 정의합니다.
 * 색상, 간격, 크기, 반경, zIndex 등을 포함합니다.
 * 필요시 추가 예정
 */
export const tokens = createTokens({
  color: {
    white: "#FFFFFF",
    black: "#000000",

    primary: "#5EC3A3", // Main Green (브랜드의 핵심 색상)
    primaryLight: "#8FE1B6", // Light Mint (배경이나 부드러운 강조)
    primarySoft: "#C9F1E3", // Soft Mint (알림 배경 등)
    secondary: "#A8DDEB", // Cool Blue (냉동실이나 보조 정보)
    secondaryDark: "#6FB7C6", // Deep Blue (강조된 냉동실 정보)

    mainText: "#2F4F64", // 깊은 네이비/그린 계열의 텍스트 컬러
    outline: "#2F4F64",

    gray1: "#F9FAFB",
    gray2: "#F3F4F6",
    gray3: "#E5E7EB",
    gray10: "#6B7280",
    gray12: "#111827",

    success: "#8FE1B6",
    warning: "#F59E0B",
    danger: "#DC2626",
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,

    true: 16, // ⭐ 필수 (기본 spacing)
  },

  size: {
    0: 0,
    1: 16,
    2: 20,
    3: 24,
    4: 32,
    5: 40,
    6: 48,

    true: 24, // ⭐ 필수 (기본 size)
  },

  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
  },

  zIndex: {
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 40,
  },
});
