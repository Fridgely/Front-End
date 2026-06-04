import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { getCategoryApi } from "../../apis/category";

export const useCategoryQuery = (fridgeId: number | null) => {
  const targetFridgeId = fridgeId ?? 0;

  return useApiQuery(
    getCategoryApi(targetFridgeId),
    ["categories", targetFridgeId],
    {
      enabled: fridgeId !== null && fridgeId !== 0,
    },
  );
};

