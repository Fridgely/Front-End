import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getFridgeListApi } from "../../apis/fridge-management";

const useFridgeListQuery = () => {
  const isLoggedIn = useIsLoggedIn();

  return useApiQuery(getFridgeListApi(), QUERY_KEYS.fridge.list(), {
    enabled: isLoggedIn,
  });
};

export { useFridgeListQuery };
