import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { AddCategoryRequest, CategoryListResponse } from "./category.types";

const getCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<void, CategoryListResponse>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("GET");

const addCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<AddCategoryRequest, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("POST");

export { addCategoryApi, getCategoryApi };
