import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { deleteFoodApi } from "../../apis/food";

interface DeleteFoodVariables {
  fridgeId: number;
  foodId: number;
}

const useDeleteFoodMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, any, DeleteFoodVariables>({
    // 요청 받는 시점에 실행
    mutationFn: async ({ fridgeId, foodId }) => {
      await deleteFoodApi(fridgeId, foodId).execute();
    },
    onSuccess: (_data, variables) => {
      const { fridgeId, foodId } = variables;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.food.all,
      });

      queryClient.removeQueries({
        queryKey: QUERY_KEYS.food.detail(fridgeId, foodId),
      });

      Toast.show({
        type: "success",
        text1: "식품 삭제 완료",
        text2: "식품이 성공적으로 삭제되었습니다.",
      });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;

      Toast.show({
        type: "error",
        text1: "삭제 실패",
        text2: serverMessage || "식품 삭제 중 오류가 발생했습니다.",
      });
    },
  });
};

export { useDeleteFoodMutation };
