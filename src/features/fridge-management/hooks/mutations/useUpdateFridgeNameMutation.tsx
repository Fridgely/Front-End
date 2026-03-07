import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateFridgeNameApi } from "../../apis/fridge-management";
import {
  UpdateFridgeNameRequest,
  UpdateFridgeNameResponse,
} from "../../apis/fridge-management.types";

export const useUpdateFridgeNameMutation = (fridgeId: number) => {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateFridgeNameRequest, UpdateFridgeNameResponse>(
    updateFridgeNameApi(fridgeId),
    {
      onSuccess: (res) => {
        if (res.result === "SUCCESS") {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.fridge.all });

          Toast.show({
            type: "success",
            text1: "수정 완료",
            text2: "냉장고 이름이 성공적으로 변경되었습니다.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "수정 실패",
            text2: "응답이 올바르지 않습니다.",
          });
        }
      },
      onError: (error: any) => {
        const serverMessage = error.response?.data?.error?.message;

        Toast.show({
          type: "error",
          text1: "오류 발생",
          text2: serverMessage || "서버와 통신 중 에러가 발생했습니다.",
        });
      },
    },
  );
};
