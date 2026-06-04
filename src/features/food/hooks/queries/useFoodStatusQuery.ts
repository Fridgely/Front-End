import { getFoodStatusApi } from "@/features/food/apis/foodStatus";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

const useFoodStatusQuery = (fridgeId: number) => {
  return useApiQuery(getFoodStatusApi, QUERY_KEYS.food.status(fridgeId), {
    enabled: !!fridgeId,
  });
};

export { useFoodStatusQuery };
