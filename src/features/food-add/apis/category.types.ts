import { Category } from "../types";

interface CategoryListResponse {
  result: string;
  data: Category[];
}

export type { CategoryListResponse };
