import { FoodItem, StorageType } from "@/shared/types/food";

export type {
  FoodStatusData,
  FoodStatusResponse,
} from "@/features/food/apis/foodStatus.types";

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

export type { FoodCursorSortBy, FridgeFoodsCursorRequest, FridgeFoodsResponseRaw };
