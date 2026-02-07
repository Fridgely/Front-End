import { createFont } from "tamagui";

export const gyeonggiFont = createFont({
  family: "GyeonggiFont",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
    true: 14,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 22,
    4: 24,
    5: 26,
    6: 30,
    true: 20,
  },
  weight: {
    4: "400",
    7: "700",
  },
  face: {
    400: { normal: "GyeonggiBatang-Bold" },
    700: { normal: "GyeonggiTitle-Bold" },
  },
});

export const baeminFont = createFont({
  family: "BMJUA",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 22,
    true: 14,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 22,
    4: 24,
    5: 26,
    6: 30,
    true: 20,
  },
  face: {
    400: { normal: "BMJUA" },
    700: { normal: "BMJUA" },
  },
});
