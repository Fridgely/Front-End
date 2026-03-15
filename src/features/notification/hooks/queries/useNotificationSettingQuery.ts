import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { getNotificationSettingsApi } from "../../apis/notification";

const useNotificationSettingQuery = () => {
  return useApiQuery(
    getNotificationSettingsApi(),
    QUERY_KEYS.notification.settings(),
  );
};

export { useNotificationSettingQuery };
