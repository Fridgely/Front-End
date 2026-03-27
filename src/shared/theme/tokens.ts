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

    surface: "#FFFFFF",
    surfaceDark: "#121B19",

    iconBackground: "#E9FDF7",
    iconBackgroundDark: "#173A30",

    primary: "#2BEEAD",
    primaryDark: "#26D19B",

    secondary: "#10B981",
    secondaryDark: "#22C55E",

    background: "#F6F8F7",
    backgroundDark: "#0B1110",

    mainText: "#111816",
    mainTextDark: "#E5EBE9",

    gray: "#64748B",
    grayDark: "#94A3B8",

    gray1: "#F9FAFB",
    gray1Dark: "#0F1715",
    gray2: "#F3F4F6",
    gray2Dark: "#16201D",
    gray3: "#E5E7EB",
    gray3Dark: "#22302C",
    gray4: "#D1D5DB",
    gray4Dark: "#33423E",
    gray5: "#9CA3AF",
    gray5Dark: "#4A5A56",
    gray9: "#6B7280",
    gray9Dark: "#9AA7A3",
    gray10: "#6B7280",
    gray10Dark: "#B4C0BC",
    gray12: "#111827",
    gray12Dark: "#E5EBE9",

    blue1: "#EFF6FF",
    blue1Dark: "#0F1B2B",
    blue5: "#93C5FD",
    blue5Dark: "#2A4A75",
    blue10: "#1D4ED8",
    blue10Dark: "#93B6E5",

    success: "#22C55E",
    successBackground: "#F2F9F2",
    successBackgroundDark: "#153322",
    warning: "#EF4444",
    warningBackground: "#FCF1F1",
    warningBackgroundDark: "#3B1616",
    alert: "#F97316",
    alertBackground: "#FFF8ED",
    alertBackgroundDark: "#3C2814",
    expired: "#1E293B",
    expiredDark: "#94A3B8",
    expiredBackground: "#F1F5F9",
    expiredBackgroundDark: "#1A2433",
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
    5: 20,
    6: 24,
  },

  zIndex: {
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 40,
  },
});
