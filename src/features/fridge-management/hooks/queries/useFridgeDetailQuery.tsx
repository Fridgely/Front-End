import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFridgeDetailApi } from "../../apis/fridge-management";

const useFridgeDetailQuery = (fridgeId: number) => {
  return useApiQuery(
    getFridgeDetailApi(fridgeId),
    QUERY_KEYS.fridge.detail(fridgeId),
    {
      enabled: !!fridgeId,
    },
  );
};

export { useFridgeDetailQuery };
