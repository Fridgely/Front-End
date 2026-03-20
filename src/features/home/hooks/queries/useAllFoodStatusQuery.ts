import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFoodStatusApi } from "../../apis/food";

const useAllFoodStatusQuery = (enabled = true) => {
  return useApiQuery(getFoodStatusApi, QUERY_KEYS.food.statusAll(), {
    enabled,
  });
};

export { useAllFoodStatusQuery };
