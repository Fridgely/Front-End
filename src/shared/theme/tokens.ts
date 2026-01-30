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

    primary: "#2BEEAD",
    primaryDark: "#26D19B",

    secondary: "#10B981",
    secondaryDark: "#22C55E",

    background: "#F6F8F7",
    backgroundDark: "#0B1110",

    mainText: "#111816",
    mainTextDark: "#E5EBE9",

    gray: "#64748B",
    grayDark: "#1A2522",

    gray1: "#F9FAFB",
    gray2: "#F3F4F6",
    gray3: "#E5E7EB",
    gray10: "#6B7280",
    gray12: "#111827",

    success: "#22C55E",
    warning: "#EF4444",
    alert: "#F97316",
  },

  space: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,

    true: 16,
  },

  size: {
    0: 0,
    1: 16,
    2: 20,
    3: 24,
    4: 32,
    5: 40,
    6: 48,

    true: 24,
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
