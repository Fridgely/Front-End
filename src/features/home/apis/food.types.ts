import { FoodItem, StorageType } from "@/shared/types/food";

type FoodStatusData = {
  black: FoodItem[];
  red: FoodItem[];
  yellow: FoodItem[];
  green: FoodItem[];
  blackCount: number;
  redCount: number;
  yellowCount: number;
  greenCount: number;
};

interface FoodStatusResponse {
  result: string;
  data: FoodStatusData;
}

type FoodCursorSortBy = "EXPIRATION" | "CREATED" | "NAME";

interface FridgeFoodsCursorRequest {
  cursorId?: number;
  size?: number;
  sortBy?: FoodCursorSortBy;
  storageType?: StorageType;
}

// 커서 기반 응답
interface FridgeFoodsDataRaw {
  foods?: FoodItem[];
  content?: FoodItem[];
  items?: FoodItem[];
}

interface FridgeFoodsResponseRaw {
  result: string;
  data: FridgeFoodsDataRaw | FoodItem[];
  nextCursorId?: number | null;
  hasMore?: boolean;
}

export type {
  FoodCursorSortBy,
  FoodStatusData,
  FoodStatusResponse,
  FridgeFoodsCursorRequest,
  FridgeFoodsResponseRaw,
};
