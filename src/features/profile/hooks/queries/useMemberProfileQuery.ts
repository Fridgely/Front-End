import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getMemberProfileApi } from "../../apis/profile";

const useMemberProfileQuery = () => {
  return useApiQuery(getMemberProfileApi, QUERY_KEYS.member.me());
};

export { useMemberProfileQuery };
