import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFoodStatusApi } from "@/features/food/apis/foodStatus";
import type { FoodStatusResponse } from "@/features/food/apis/foodStatus.types";
import { normalizeFoodItem } from "../../utils/normalizeFoodItem";

const useAllFoodStatusQuery = (enabled = true) => {
  const isLoggedIn = useIsLoggedIn();

  return useApiQuery(getFoodStatusApi, QUERY_KEYS.food.statusAll(), {
    enabled: isLoggedIn && enabled,
    select: (response: FoodStatusResponse) => ({
      ...response,
      data: {
        ...response.data,
        black: response.data.black.map((food) => normalizeFoodItem(food)),
        red: response.data.red.map((food) => normalizeFoodItem(food)),
        yellow: response.data.yellow.map((food) => normalizeFoodItem(food)),
        green: response.data.green.map((food) => normalizeFoodItem(food)),
      },
    }),
  });
};

export { useAllFoodStatusQuery };
