import type { FoodItem } from "@/shared/types/food";

interface FoodDetailResponse {
  result: string;
  data: FoodItem;
}

export type { FoodDetailResponse };
