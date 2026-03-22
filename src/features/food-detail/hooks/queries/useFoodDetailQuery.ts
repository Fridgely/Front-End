import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFoodDetailApi } from "../../apis/food-detail";

const useFoodDetailQuery = (
  refrigeratorId: number | null,
  foodId: number | null,
) => {
  return useApiQuery(
    getFoodDetailApi(refrigeratorId ?? 0, foodId ?? 0),
    QUERY_KEYS.food.detail(refrigeratorId ?? 0, foodId ?? 0),
    {
      enabled: refrigeratorId !== null && foodId !== null,
    },
  );
};

export { useFoodDetailQuery };
