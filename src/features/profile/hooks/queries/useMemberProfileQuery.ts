import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMemberProfileApi } from "../../apis/profile";

const useMemberProfileQuery = () => {
  const isLoggedIn = useIsLoggedIn();

  return useApiQuery(getMemberProfileApi, QUERY_KEYS.member.me(), {
    enabled: isLoggedIn,
  });
};

export { useMemberProfileQuery };
