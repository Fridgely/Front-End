import { FoodFormValues } from "@/features/food-add/types";
import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { updateFoodApi } from "../../apis/food-edit";

const useUpdateFoodMutation = (fridgeId: number, foodId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useApiMutation<FormData, void>(
    updateFoodApi(fridgeId, foodId),
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "식품 수정 완료",
          text2: "식품 정보가 성공적으로 수정되었습니다.",
        });

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.food.statusAll(),
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.food.status(fridgeId),
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.food.statusByRefrigerator(fridgeId),
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.food.detail(fridgeId, foodId),
        });

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      },
      onError: (error: any) => {
        const serverMessage = error.response?.data?.error?.message;

        Toast.show({
          type: "error",
          text1: "수정 실패",
          text2: serverMessage || "식품 수정 중 오류가 발생했습니다.",
        });
      },
    },
  );

  const updateFood = (values: FoodFormValues) => {
    const formData = new FormData();

    let dateString = "";
    if (values.expirationDate instanceof Date) {
      dateString = values.expirationDate.toISOString();
    } else if (values.expirationDate) {
      dateString = new Date(values.expirationDate).toISOString();
    } else {
      dateString = new Date().toISOString();
    }

    const requestPayload = {
      name: values.name,
      categoryId: values.categoryId,
      amount: values.amount,
      unit: values.unit,
      expirationDate: dateString,
      storageType: values.storageType,
      description: values.description || "",
    };

    formData.append("request", {
      string: JSON.stringify(requestPayload),
      type: "application/json",
    } as any);

    if (values.imageURL) {
      const uri = values.imageURL;
      const fileName = uri.split("/").pop() || `food_${Date.now()}.jpg`;

      const extension = fileName.split(".").pop()?.toLowerCase();
      let mimeType = "image/jpeg";
      if (extension === "png") mimeType = "image/png";
      if (extension === "gif") mimeType = "image/gif";

      formData.append("image", {
        uri,
        name: fileName,
        type: mimeType,
      } as any);
    }

    return mutation.mutate(formData);
  };

  return { ...mutation, mutate: updateFood };
};

export { useUpdateFoodMutation };
