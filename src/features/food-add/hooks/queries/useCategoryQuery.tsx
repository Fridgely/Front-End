import { useApiQuery } from "@/shared/apis/builder/ApiBuilder";
import { getCategoryApi } from "../../apis/category";

const useCategoryQuery = (fridgeId: number) => {
  return useApiQuery(getCategoryApi(fridgeId), ["categories", fridgeId], {
    enabled: !!fridgeId,
  });
};

export { useCategoryQuery };
