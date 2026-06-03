import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type {
  AddCategoryRequest,
  CategoryListResponse,
  UpdateCategoryRequest,
} from "./category.types";

export const getCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<void, CategoryListResponse>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("GET");

export const addCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<AddCategoryRequest, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("POST");

export const updateCategoryApi = (refrigeratorId: number, categoryId: number) =>
  ApiBuilder.create<UpdateCategoryRequest, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
  ).setMethod("PATCH");

export const deleteCategoryApi = (refrigeratorId: number, categoryId: number) =>
  ApiBuilder.create<void, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
  ).setMethod("DELETE");

