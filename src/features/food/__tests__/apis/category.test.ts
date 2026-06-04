import {
  addCategoryApi,
  deleteCategoryApi,
  getCategoryApi,
  updateCategoryApi,
} from "@/features/food/apis/category";

describe("Category API 테스트", () => {
  it("getCategoryApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const refrigeratorId = 1;
    const api = getCategoryApi(refrigeratorId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${refrigeratorId}/categories`);
    expect(api.method).toBe("GET");
  });

  it("addCategoryApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const refrigeratorId = 1;
    const api = addCategoryApi(refrigeratorId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${refrigeratorId}/categories`);
    expect(api.method).toBe("POST");
  });

  it("updateCategoryApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const refrigeratorId = 1;
    const categoryId = 123;
    const api = updateCategoryApi(refrigeratorId, categoryId) as any;
    expect(api.endpoint).toBe(
      `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
    );
    expect(api.method).toBe("PATCH");
  });

  it("deleteCategoryApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const refrigeratorId = 1;
    const categoryId = 123;
    const api = deleteCategoryApi(refrigeratorId, categoryId) as any;
    expect(api.endpoint).toBe(
      `/api/v1/refrigerators/${refrigeratorId}/categories/${categoryId}`,
    );
    expect(api.method).toBe("DELETE");
  });
});

