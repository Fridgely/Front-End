import { getFridgeMembersApi } from "../../apis/fridge-member";

describe("getFridgeMembersApi 테스트", () => {
  it("getFridgeMembersApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const fridgeId = 1;
    const api = getFridgeMembersApi(fridgeId) as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/${fridgeId}/members`);
    expect(api.method).toBe("GET");
  });
});
