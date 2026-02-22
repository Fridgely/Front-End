import { Category } from "../types";

interface CategoryListResponse {
  result: string;
  data: Category[];
}

interface AddCategoryRequest {
  name: string;
}

export type { AddCategoryRequest, CategoryListResponse };
