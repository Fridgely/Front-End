/**
 * 다른 정보에 유통기한과 d-day가 있어서 상태 텍스트 추가
 */
const FOOD_STATUS_TEXT = {
  GREEN: "안전",
  YELLOW: "주의",
  RED: "임박",
  BLACK: "만료",
} as const;

export { FOOD_STATUS_TEXT };
