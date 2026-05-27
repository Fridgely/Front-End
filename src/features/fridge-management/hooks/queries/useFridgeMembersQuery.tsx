import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFridgeMembersApi } from "../../apis/fridge-member";

const useFridgeMembersQuery = (fridgeId: number) => {
  return useApiQuery(
    getFridgeMembersApi(fridgeId),
    QUERY_KEYS.fridge.members(fridgeId),
    {
      enabled: !!fridgeId && fridgeId !== 0,
    },
  );
};

export { useFridgeMembersQuery };
