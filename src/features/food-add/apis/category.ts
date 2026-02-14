import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { CategoryListResponse } from "./category.types";

const getCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<void, CategoryListResponse>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("GET");

export { getCategoryApi };
