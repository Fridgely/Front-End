import { FoodItem, FoodStatus } from "@/shared/types/food";

type FoodStatusData = {
  [key in FoodStatus]: FoodItem[];
};

interface FoodStatusResponse {
  result: string;
  data: FoodStatusData;
}

export { FoodStatusResponse };
