import type { Category } from "../types";

export interface CategoryListResponse {
  result: string;
  data: Category[];
}

export interface AddCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  newName: string;
}

