import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import {
  AddCategoryRequest,
  CategoryListResponse,
  UpdateCategoryRequest,
} from "./category.types";

const getCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<void, CategoryListResponse>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("GET");

const addCategoryApi = (refrigeratorId: number) =>
  ApiBuilder.create<AddCategoryRequest, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories`,
  ).setMethod("POST");

const updateCategoryApi = (refrigeratorId: number, categoryId: number) =>
  ApiBuilder.create<UpdateCategoryRequest, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
  ).setMethod("PATCH");

const deleteCategoryApi = (refrigeratorId: number, categoryId: number) =>
  ApiBuilder.create<void, void>(
    `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
  ).setMethod("DELETE");

export {
  addCategoryApi,
  deleteCategoryApi,
  getCategoryApi,
  updateCategoryApi,
};
