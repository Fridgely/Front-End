import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFoodStatusApi } from "../../apis/food";

const useFoodStatusQuery = (fridgeId: number) => {
  return useApiQuery(getFoodStatusApi, QUERY_KEYS.food.status(fridgeId), {
    enabled: !!fridgeId,
  });
};

export { useFoodStatusQuery };
