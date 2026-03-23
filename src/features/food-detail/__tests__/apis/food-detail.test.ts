import { getFoodDetailApi } from "../../apis/food-detail";

describe("Food Detail API 테스트", () => {
  it("getFoodDetailApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getFoodDetailApi(123, 456) as any;

    expect(api.endpoint).toBe("/api/v1/refrigerators/123/foods/456");
    expect(api.method).toBe("GET");
  });
});
