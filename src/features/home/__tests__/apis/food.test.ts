import {
  deleteFoodApi,
  getFoodStatusApi,
  getFridgeFoodsApi,
} from "../../apis/food";

describe("Food API 테스트", () => {
  it("getFoodStatusApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getFoodStatusApi as any;
    expect(api.endpoint).toBe("/api/v1/foods/status");
    expect(api.method).toBe("GET");
  });

  it("getFridgeFoodsApi는 냉장고별 조회 URL, 메소드, params가 올바르게 설정되어야 한다", () => {
    const api = getFridgeFoodsApi(3, {
      size: 50,
      sortBy: "EXPIRATION",
    }) as any;

    expect(api.endpoint).toBe("/api/v1/refrigerators/3/foods");
    expect(api.method).toBe("GET");
    expect(api.config.params).toEqual({
      size: 50,
      sortBy: "EXPIRATION",
    });
  });

  it("deleteFoodApi는 올바른 URL과 메소드로 올바르게 설정되어야 한다", () => {
    const api = deleteFoodApi(123, 456) as any;

    expect(api.endpoint).toBe("/api/v1/refrigerators/123/foods/456");
    expect(api.method).toBe("DELETE");
  });
});
