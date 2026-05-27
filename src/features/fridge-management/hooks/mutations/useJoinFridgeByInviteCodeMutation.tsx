import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { joinFridgeByInviteCodeApi } from "../../apis/invitation";

export const useJoinFridgeByInviteCodeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useApiMutation(joinFridgeByInviteCodeApi(), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fridge.list() });
      Toast.show({ type: "success", text1: "냉장고 참여 완료!" });
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;

      Toast.show({
        type: "error",
        text1: serverMessage || "참여에 실패했습니다. 다시 시도해주세요.",
      });
    },
  });
};
