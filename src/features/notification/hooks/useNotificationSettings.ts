import { NotificationSettingsRequest } from "../apis/notification.types";
import { useUpdateNotificationSettingMutation } from "./mutations/useUpdateNotificationSettingMutation";
import { useNotificationSettingQuery } from "./queries/useNotificationSettingQuery";

const useNotificationSettings = () => {
  const query = useNotificationSettingQuery();
  const mutation = useUpdateNotificationSettingMutation();

  const settings = query.data?.data;

  const updateSettings = (changes: Partial<NotificationSettingsRequest>) => {
    if (!settings || mutation.isPending) {
      return;
    }

    mutation.mutate({
      notificationTime: changes.notificationTime ?? settings.notificationTime,
      daysBeforeExpiration:
        changes.daysBeforeExpiration ?? settings.daysBeforeExpiration,
      enabled: changes.enabled ?? settings.enabled,
    });
  };

  return {
    ...query,
    data: settings,
    updateSettings,
    isUpdating: mutation.isPending,
  };
};

export { useNotificationSettings };
