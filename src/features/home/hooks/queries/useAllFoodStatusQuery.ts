import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFoodStatusApi } from "../../apis/food";
import { FoodStatusResponse } from "../../apis/food.types";
import { normalizeFoodItem } from "../../utils/normalizeFoodItem";

const useAllFoodStatusQuery = (enabled = true) => {
  return useApiQuery(getFoodStatusApi, QUERY_KEYS.food.statusAll(), {
    enabled,
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
