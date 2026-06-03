import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateCategoryApi } from "../../apis/category";

interface UpdateCategoryVariables {
  categoryId: number;
  newName: string;
}

export const useUpdateCategoryMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, any, UpdateCategoryVariables>({
    mutationFn: async ({ categoryId, newName }) => {
      await updateCategoryApi(fridgeId, categoryId).setData({ newName }).execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", fridgeId] });
      Toast.show({
        type: "success",
        text1: "카테고리 수정 완료",
        text2: "카테고리 이름이 변경되었습니다.",
      });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;
      Toast.show({
        type: "error",
        text1: "수정 실패",
        text2: serverMessage || "카테고리 수정 중 오류가 발생했습니다.",
      });
    },
  });
};

