import { addFoodApi } from "../../apis/food";

describe("addFood API 테스트", () => {
  it("addFoodApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const refrigeratorId = 1;
    const api = addFoodApi(refrigeratorId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${refrigeratorId}/foods`);
    expect(api.method).toBe("POST");
  });
});
