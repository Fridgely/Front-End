import { updateFoodApi } from "../../apis/food-edit";

describe("updateFood API 테스트", () => {
  it("updateFoodApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const fridgeId = 123;
    const foodId = 456;
    const api = updateFoodApi(fridgeId, foodId) as any;
    expect(api.endpoint).toBe(
      `/api/v1/refrigerators/${fridgeId}/foods/${foodId}`,
    );
    expect(api.method).toBe("PATCH");
  });

  it("헤더가 multipart/form-data로 설정되어야 한다", () => {
    const api = updateFoodApi(123, 456) as any;
    expect(api.config.headers).toEqual({
      "Content-Type": "multipart/form-data",
    });
  });
});
