import {
  getFridgeDetailApi,
  getFridgeListApi,
  updateFridgeNameApi,
} from "../../apis/fridge-management";

describe("Fridge Management API 테스트", () => {
  it("getFridgeListApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getFridgeListApi() as any;
    expect(api.endpoint).toBe("/api/v1/refrigerators");
    expect(api.method).toBe("GET");
  });
  it("getFridgeDetailApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const fridgeId = 1;
    const api = getFridgeDetailApi(fridgeId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${fridgeId}`);
    expect(api.method).toBe("GET");
  });
  it("updateFridgeNameApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const fridgeId = 1;
    const api = updateFridgeNameApi(fridgeId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${fridgeId}`);
    expect(api.method).toBe("PATCH");
  });
});
