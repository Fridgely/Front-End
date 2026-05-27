import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { addCategoryApi } from "../../apis/category";
import { AddCategoryRequest } from "../../apis/category.types";

const useAddCategoryMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useApiMutation<AddCategoryRequest, void>(addCategoryApi(fridgeId), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", fridgeId] });
      Toast.show({
        type: "success",
        text1: "카테고리 추가 완료",
        text2: "새 카테고리가 성공적으로 추가되었습니다.",
      });
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;
      Toast.show({
        type: "error",
        text1: "추가 실패",
        text2: serverMessage || "카테고리 추가 중 오류가 발생했습니다.",
      });
    },
  });
};

export { useAddCategoryMutation };
