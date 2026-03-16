import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { leaveFridgeApi } from "../../apis/fridge-management";

export const useLeaveFridgeMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(leaveFridgeApi(fridgeId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fridge.list() });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.fridge.detail(fridgeId),
      });

      Toast.show({
        type: "success",
        text1: "냉장고 나가기 완료",
        text2: "해당 냉장고 멤버에서 제외되었습니다.",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        "냉장고를 나가는 중 오류가 발생했습니다.";
      Toast.show({ type: "error", text1: "실패", text2: message });
    },
  });
};
