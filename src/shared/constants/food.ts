import { FoodStatus, StorageType } from "../types/food";

const STORAGE_TYPE_LABELS: Record<StorageType, string> = {
  REFRIGERATION: "냉장",
  FROZEN: "냉동",
  ROOM_TEMPERATURE: "실온",
} as const;

const STORAGE_TABS = ["전체", ...Object.values(STORAGE_TYPE_LABELS)];

const FOOD_STATUS_LABELS: Record<FoodStatus, string> = {
  GREEN: "$success",
  YELLOW: "$alert",
  RED: "$warning",
  BLACK: "$expired",
} as const;

const FOOD_STATUS_BG_COLORS: Record<FoodStatus, string> = {
  GREEN: "$successBackground",
  YELLOW: "$alertBackground",
  RED: "$warningBackground",
  BLACK: "$expiredBackground",
} as const;

export {
  FOOD_STATUS_BG_COLORS,
  FOOD_STATUS_LABELS,
  STORAGE_TABS,
  STORAGE_TYPE_LABELS,
};
