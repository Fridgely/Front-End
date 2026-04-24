import { NotificationSettingsRequest } from "../apis/notification.types";
import { useUpdateNotificationSettingMutation } from "./mutations/useUpdateNotificationSettingMutation";
import { useNotificationSettingQuery } from "./queries/useNotificationSettingQuery";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

const useNotificationSettings = () => {
  const queryClient = useQueryClient();
  const query = useNotificationSettingQuery();
  const mutation = useUpdateNotificationSettingMutation();

  const settings = query.data?.data;

  const updateSettings = useCallback(
    (changes: Partial<NotificationSettingsRequest>) => {
      const cached =
        queryClient.getQueryData<{ data: NotificationSettingsRequest }>(
          QUERY_KEYS.notification.settings(),
        )?.data ?? settings;

      if (!cached) return;

      mutation.mutate({
        notificationTime: changes.notificationTime ?? cached.notificationTime,
        daysBeforeExpiration:
          changes.daysBeforeExpiration ?? cached.daysBeforeExpiration,
        enabled: changes.enabled ?? cached.enabled,
      });
    },
    [mutation, queryClient, settings],
  );

  return {
    ...query,
    data: settings,
    updateSettings,
    isUpdating: mutation.isPending,
  };
};

export { useNotificationSettings };
