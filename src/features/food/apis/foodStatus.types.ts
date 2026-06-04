import { FoodItem } from "@/shared/types/food";

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

export type { FoodStatusData, FoodStatusResponse };
