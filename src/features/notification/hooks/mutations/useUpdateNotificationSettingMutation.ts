import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateNotificationSettingsApi } from "../../apis/notification";
import { NotificationSettingsRequest } from "../../apis/notification.types";

type NotificationSettingsQueryData = { data: NotificationSettingsRequest };
type MutationContext = { previous?: NotificationSettingsQueryData };

const useUpdateNotificationSettingMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation<NotificationSettingsRequest, void>(
    updateNotificationSettingsApi(),
    {
      onMutate: async (nextSettings) => {
        const queryKey = QUERY_KEYS.notification.settings();

        await queryClient.cancelQueries({ queryKey });

        const previous = queryClient.getQueryData<NotificationSettingsQueryData>(
          queryKey,
        );

        // UI를 즉시 반영하기 위한 낙관적 업데이트
        queryClient.setQueryData<NotificationSettingsQueryData>(
          queryKey,
          (old) => {
            const current = old?.data ?? previous?.data;
            if (!current) return old as any;
            return {
              ...old,
              data: {
                ...current,
                ...nextSettings,
              },
            };
          },
        );

        return { previous } satisfies MutationContext;
      },
      onError: (error: any, _variables, context) => {
        const queryKey = QUERY_KEYS.notification.settings();
        const ctx = context as MutationContext | undefined;
        if (ctx?.previous) {
          queryClient.setQueryData(queryKey, ctx.previous);
        }

        const serverMessage = error.response?.data?.error?.message;
        Toast.show({
          type: "error",
          text1: "설정 업데이트 실패",
          text2: serverMessage || "알림 설정 업데이트 중 오류가 발생했습니다.",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.notification.settings(),
        });
      },
    },
  );
};

export { useUpdateNotificationSettingMutation };
