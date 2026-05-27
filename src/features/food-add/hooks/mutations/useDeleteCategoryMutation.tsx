import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { deleteCategoryApi } from "../../apis/category";

interface DeleteCategoryVariables {
  categoryId: number;
}

const useDeleteCategoryMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, any, DeleteCategoryVariables>({
    mutationFn: async ({ categoryId }) => {
      await deleteCategoryApi(fridgeId, categoryId).execute();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", fridgeId] });
      Toast.show({
        type: "success",
        text1: "카테고리 삭제 완료",
        text2: "카테고리가 삭제되었습니다.",
      });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;
      Toast.show({
        type: "error",
        text1: "삭제 실패",
        text2: serverMessage || "카테고리 삭제 중 오류가 발생했습니다.",
      });
    },
  });
};

export { useDeleteCategoryMutation };
