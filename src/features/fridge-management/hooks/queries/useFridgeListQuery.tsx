import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFridgeListApi } from "../../apis/fridge-management";

const useFridgeListQuery = () => {
  return useApiQuery(getFridgeListApi(), QUERY_KEYS.fridge.list());
};

export { useFridgeListQuery };
