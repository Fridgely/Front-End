import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { deleteFridgeApi } from "../../apis/fridge-management";

export const useDeleteFridgeMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>(deleteFridgeApi(fridgeId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fridge.list() });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.fridge.detail(fridgeId),
      });
      Toast.show({ type: "success", text1: "냉장고가 삭제되었습니다." });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message || "삭제 중 오류가 발생했습니다.";
      Toast.show({ type: "error", text1: "삭제 실패", text2: message });
    },
  });
};
