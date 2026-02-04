import { getFridgeApi } from "../../apis/fridge";

describe("Fridge API 테스트", () => {
  it("getFridgeApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getFridgeApi as any;
    expect(api.endpoint).toBe("/api/v1/refrigerators");
    expect(api.method).toBe("GET");
  });
});
