import { getFridgeApi } from "@/features/home/apis/fridge";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

const useFridgeQuery = () => {
  return useApiQuery(getFridgeApi, QUERY_KEYS.fridge.list());
};

export { useFridgeQuery };
