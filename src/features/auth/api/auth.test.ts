import { loginApi, signupApi } from "../api/auth";

describe("Auth API 테스트", () => {
  it("loginApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    // private 속성에 접근하기 위해 any로 캐스팅
    const api = loginApi as any;
    expect(api.endpoint).toBe("/api/v1/auth/login");
    expect(api.method).toBe("POST");
  });

  it("signupApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = signupApi as any;
    expect(api.endpoint).toBe("/api/v1/members");
    expect(api.method).toBe("POST");
  });
});
