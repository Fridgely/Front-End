import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { getFridgeApi } from "@/features/fridge/apis/fridge";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

const useFridgeQuery = () => {
  const isLoggedIn = useIsLoggedIn();

  return useApiQuery(getFridgeApi, QUERY_KEYS.fridge.list(), {
    enabled: isLoggedIn,
  });
};

export { useFridgeQuery };
