import { Category } from "../types";

interface CategoryListResponse {
  result: string;
  data: Category[];
}

interface AddCategoryRequest {
  name: string;
}

interface UpdateCategoryRequest {
  newName: string;
}

export type {
  AddCategoryRequest,
  CategoryListResponse,
  UpdateCategoryRequest,
};
