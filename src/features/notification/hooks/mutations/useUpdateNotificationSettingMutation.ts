import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateNotificationSettingsApi } from "../../apis/notification";
import { NotificationSettingsRequest } from "../../apis/notification.types";

const useUpdateNotificationSettingMutation = () => {
  const queryClient = useQueryClient();

  return useApiMutation<NotificationSettingsRequest, void>(
    updateNotificationSettingsApi(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.notification.settings(),
        });
      },
      onError: (error: any) => {
        const serverMessage = error.response?.data?.error?.message;
        Toast.show({
          type: "error",
          text1: "설정 업데이트 실패",
          text2: serverMessage || "알림 설정 업데이트 중 오류가 발생했습니다.",
        });
      },
    },
  );
};

export { useUpdateNotificationSettingMutation };
