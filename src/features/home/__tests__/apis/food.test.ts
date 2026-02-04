import { getFoodStatusApi } from "../../apis/food";

describe("Food API 테스트", () => {
  it("getFoodStatusApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getFoodStatusApi as any;
    expect(api.endpoint).toBe("/api/v1/foods/status");
    expect(api.method).toBe("GET");
  });
});
