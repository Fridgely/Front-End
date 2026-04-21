import { Dimensions, PixelRatio } from "react-native";

// pixel7 기준으로 스케일 계산
const BASE_WIDTH = 412;
const BASE_HEIGHT = 915;

function getWindow() {
  return Dimensions.get("window");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getWidthScale() {
  const { width } = getWindow();
  return width / BASE_WIDTH;
}

function getHeightScale() {
  const { height } = getWindow();
  return height / BASE_HEIGHT;
}

/**
 * 폭 기반 스케일.
 * - spacing/icon/radius 같은 레이아웃 크기에 사용
 * - 작은 폰에서는 줄고, 큰 폰에서는 거의 원본을 유지
 */
export function s(size: number) {
  const scaled = size * getWidthScale();
  const capped = clamp(scaled, size * 0.88, size * 1.02);
  return PixelRatio.roundToNearestPixel(capped);
}

/**
 * 높이(height) 기반 스케일.
 * - 세로 길이에 민감해질 수 있으니 필요한 곳에만 제한적으로 사용
 */
export function vs(size: number) {
  const scaled = size * getHeightScale();
  const capped = clamp(scaled, size * 0.9, size * 1.03);
  return PixelRatio.roundToNearestPixel(capped);
}

/**
 * 완화 스케일(moderate scale).
 * - 원본 값과 스케일 값을 섞어서 과한 변화 방지
 * - factor는 보통 0.3~0.5 권장
 */
export function ms(size: number, factor = 0.4) {
  const scaled = s(size);
  return PixelRatio.roundToNearestPixel(size + (scaled - size) * factor);
}

/**
 * 폰트 크기 정규화(font size normalize).
 * - 작은 폰에서는 확실히 줄이되, OS 접근성 설정(fontScale)은 React Native가 자동 반영하므로 여기서 나누지 않는다.
 * - 레이아웃 스케일과 분리해서 폰트 전용으로 사용
 */
export function fs(size: number, options?: { min?: number; max?: number }) {
  const scaled = ms(size, 0.35);
  const min = options?.min ?? size * 0.88;
  const max = options?.max ?? size * 1.02;
  return PixelRatio.roundToNearestPixel(clamp(scaled, min, max));
}

export function lh(fontSize: number, lineHeightRatio = 1.35) {
  return Math.round(fontSize * lineHeightRatio);
}

export type DeviceSize = "sm" | "md" | "lg";

export function getDeviceSize(): DeviceSize {
  const { width, height } = getWindow();
  /**
   * 폭이 360dp여도 기기마다 세로가 크게 달라서,
   * 단순히 width만으로 sm/md를 나누면 실제 기기에서 깨질 수 있다.
   *
   * - Small Phone AVD(720x1280@320dpi) ≈ 360x640dp → sm
   * - Galaxy A32(720x1600@~270dpi) ≈ 360x800dp → md로 취급
   */
  if (width <= 360 && height <= 720) return "sm";
  if (width <= 410) return "md";
  return "lg";
}

/**
 * 반응형 값 선택 헬퍼(media-query 없이 사용).
 * - `getDeviceSize()` 결과(sm/md/lg)에 따라 값을 선택한다.
 */
export function rv<T>(values: { sm: T; md: T; lg: T }) {
  const size = getDeviceSize();
  return values[size];
}

export const DEFAULT_BOTTOM_SPACING = ms(24);

export function getBottomPaddingForSheet({
  bottomInset,
  extraSpacing = DEFAULT_BOTTOM_SPACING,
}: {
  bottomInset: number;
  extraSpacing?: number;
}) {
  return bottomInset + extraSpacing;
}

export const spacing = {
  xs: ms(4),
  sm: ms(8),
  md: ms(12),
  lg: ms(16),
  xl: ms(20),
  "2xl": ms(24),
} as const;

export const radius = {
  sm: ms(8),
  md: ms(12),
  lg: ms(16),
  xl: ms(20),
} as const;
