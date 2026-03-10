import {
  generateInviteCodeApi,
  joinFridgeByInviteCodeApi,
} from "../../apis/invitation";

describe("generateInviteCodeApi 테스트", () => {
  it("generateInviteCodeApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const fridgeId = 1;
    const api = generateInviteCodeApi(fridgeId) as any;
    expect(api.endpoint).toBe(
      `/api/v1/refrigerators/${fridgeId}/invitation-codes`,
    );
    expect(api.method).toBe("POST");
  });

  it("joinFridgeByInviteCodeApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = joinFridgeByInviteCodeApi() as any;
    expect(api.endpoint).toBe(`/api/v1/refrigerators/invitation-codes/join`);
    expect(api.method).toBe("POST");
  });
});
