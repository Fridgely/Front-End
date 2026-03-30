import { getMemberProfileApi, logoutApi } from "./profile";

jest.mock("../../../shared/lib/tokenStorage/tokenStorage");

describe("마이페이지 API 테스트", () => {
  it("logoutApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = logoutApi as any;
    expect(api.endpoint).toBe("/api/v1/auth/logout");
    expect(api.method).toBe("POST");
  });

  it("getMemberProfileApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getMemberProfileApi as any;
    expect(api.endpoint).toBe("/api/v1/members/me");
    expect(api.method).toBe("GET");
  });
});
