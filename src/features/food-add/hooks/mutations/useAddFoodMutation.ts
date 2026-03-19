import { addFoodApi } from "@/features/food-add/apis/food";
import { FoodFormValues } from "@/features/food-add/types";
import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const useAddFoodMutation = (fridgeId: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useApiMutation<FormData, void>(addFoodApi(fridgeId), {
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "식품 등록 완료",
        text2: "냉장고에 식품이 성공적으로 추가되었습니다.",
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.food.all,
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
        text1: "등록 실패",
        text2: serverMessage || "식품 등록 중 오류가 발생했습니다.",
      });
    },
  });

  // FoodFormValues를 받아서 FormData로 변환 후 전송
  const addFood = (values: FoodFormValues) => {
    const formData = new FormData();

    let dateString = "";
    if (values.expirationDate instanceof Date) {
      dateString = values.expirationDate.toISOString();
    } else if (values.expirationDate) {
      // 혹시 string으로 들어왔을 경우를 대비
      dateString = new Date(values.expirationDate).toISOString();
    } else {
      // 데이터가 없을 경우 오늘 날짜로 대체하거나 에러 처리
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

    // request 파트를 Blob으로 감싸서 application/json 타입을 명시합니다.
    formData.append("request", {
      string: JSON.stringify(requestPayload),
      type: "application/json",
    } as any);

    if (values.imageURL) {
      const uri = values.imageURL;
      const fileName = uri.split("/").pop() || `food_${Date.now()}.jpg`;

      const extension = fileName.split(".").pop()?.toLowerCase();
      let mimeType = "image/jpeg"; // 기본값
      if (extension === "png") mimeType = "image/png";
      if (extension === "gif") mimeType = "image/gif";

      formData.append("image", {
        uri: uri,
        name: fileName,
        type: mimeType, // image/jpeg, image/png 등
      } as any);
    }

    return mutation.mutate(formData);
  };

  return { ...mutation, mutate: addFood };
};

export { useAddFoodMutation };
