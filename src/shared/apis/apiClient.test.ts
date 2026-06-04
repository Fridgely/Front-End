import { tokenStorage } from "@/shared/lib/tokenStorage/tokenStorage";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import apiClient, { setIsLoggedInGetter } from "./apiClient";

// tokenStorage를 mocked로 타입 캐스팅
const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;

describe("apiClient 테스트", () => {
  //MockAdapter - 실제 서버와 통신 없이 가짜응답 모킹 가능
  let mock: MockAdapter;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(apiClient);
    axiosMock = new MockAdapter(axios);
    process.env.EXPO_PUBLIC_API_URL = "http://localhost:8080";
  });

  afterEach(() => {
    mock.restore();
    axiosMock.restore();
  });

  describe("요청 인터셉터 테스트", () => {
    it("엑세스 토큰이 있을 때 Authorization 헤더가 추가된다", async () => {
      const mockAccessToken = "mock-access-token";
      mockTokenStorage.getAccessToken.mockResolvedValue(mockAccessToken);
      mock.onGet("/test").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${mockAccessToken}`);
        return [200, { success: true }];
      });

      await apiClient.get("/test");
      expect(mockTokenStorage.getAccessToken).toHaveBeenCalled();
    });

    it("엑세스 토큰이 없을 때 Authorization 헤더가 추가되지 않는다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue(null);
      mock.onGet("/test").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { success: true }];
      });

      await apiClient.get("/test");
    });
  });

  describe("응답 인터셉터 테스트 - 성공", () => {
    it("성공 시 응답을 그대로 반환한다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("token");
      mock.onGet("/test").reply(200, { message: "success" });
      const response = await apiClient.get("/test");

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: "success" });
    });
  });

  describe("응답 인터셉터 테스트 - 토큰 재발급", () => {
    beforeEach(() => {
      setIsLoggedInGetter(() => true);
    });

    afterEach(() => {
      setIsLoggedInGetter(() => false);
    });

    it("401 에러 시 토큰을 재발급 받고 요청을 재시도한다", async () => {
      const oldAccessToken = "old-access-token";
      const oldRefreshToken = "old-refresh-token";
      const newAccessToken = "new-access-token";
      const newRefreshToken = "new-refresh-token";

      mockTokenStorage.getAccessToken.mockResolvedValue(oldAccessToken);
      mockTokenStorage.getRefreshToken.mockResolvedValue(oldRefreshToken);
      let requestCount = 0;

      // 첫 번째 요청은 401 반환, 재시도는 200 반환하도록 설정
      mock.onGet("/api/v1/users/me").reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [401, { message: "Unauthorized" }];
        }
        return [200, { data: "success" }];
      });

      // axios를 직접 사용하므로 axiosMock 사용
      axiosMock.onPost("http://localhost:8080/api/v1/auth/reissue").reply(200, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      const response = await apiClient.get("/api/v1/users/me");

      // 토큰 재발급이 호출되었는지 확인
      expect(mockTokenStorage.setAccessToken).toHaveBeenCalledWith(
        newAccessToken,
      );
      expect(mockTokenStorage.setRefreshToken).toHaveBeenCalledWith(
        newRefreshToken,
      );

      // 재시도 후 성공
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ data: "success" });
      expect(requestCount).toBe(2);
    });

    it("재발급 엔드포인트에 대해서는 토큰 재발급을 시도하지 않는다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("token");
      mock.onPost("/api/v1/auth/reissue").reply(401);

      await expect(apiClient.post("/api/v1/auth/reissue")).rejects.toThrow();
      expect(mockTokenStorage.setAccessToken).not.toHaveBeenCalled();
    });

    it("토큰 재발급 실패 시 토큰을 클리어한다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("old-token");
      mockTokenStorage.getRefreshToken.mockResolvedValue("old-refresh");

      // 첫 요청은 401
      mock.onGet("/api/v1/users/me").reply(401);
      axiosMock.onPost("http://localhost:8080/api/v1/auth/reissue").reply(401);

      await expect(apiClient.get("/api/v1/users/me")).rejects.toThrow();
      expect(mockTokenStorage.clear).toHaveBeenCalled();
    });

    it("토큰 재발급 후 재시도했는데도 다시 401 에러가 발생하면 토큰을 클리어한다", async () => {
      const oldAccessToken = "old-access-token";
      const oldRefreshToken = "old-refresh-token";
      const newAccessToken = "new-access-token";
      const newRefreshToken = "new-refresh-token";

      mockTokenStorage.getAccessToken.mockResolvedValue(oldAccessToken);
      mockTokenStorage.getRefreshToken.mockResolvedValue(oldRefreshToken);

      let requestCount = 0;

      // 모든 시도가 401 반환
      mock.onGet("/api/v1/users/me").reply(() => {
        requestCount++;
        return [401, { message: "Unauthorized" }];
      });

      // 토큰 재발급 성공
      axiosMock.onPost("http://localhost:8080/api/v1/auth/reissue").reply(200, {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      await expect(apiClient.get("/api/v1/users/me")).rejects.toThrow();

      // 두 번째 401에서 clear 호출
      expect(mockTokenStorage.clear).toHaveBeenCalled();
      expect(requestCount).toBe(2);
    });
  });

  describe("응답 인터셉터 테스트 - 기타 에러", () => {
    it("401 이외의 에러는 토큰 재발급 없이 거부한다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("token");
      mock.onGet("/api/v1/users/me").reply(404, { message: "Not Found" });

      await expect(apiClient.get("/api/v1/users/me")).rejects.toThrow();
      expect(mockTokenStorage.clear).not.toHaveBeenCalled();
      expect(mockTokenStorage.setAccessToken).not.toHaveBeenCalled();
    });

    it("네트워크 에러를 처리한다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("token");
      mock.onGet("/api/v1/users/me").networkError();

      await expect(apiClient.get("/api/v1/users/me")).rejects.toThrow();
    });

    it("타임아웃 에러를 처리한다", async () => {
      mockTokenStorage.getAccessToken.mockResolvedValue("token");
      mock.onGet("/api/v1/users/me").timeout();

      await expect(apiClient.get("/api/v1/users/me")).rejects.toThrow();
    });
  });

  describe("기본 설정 확인", () => {
    it("EXPO_PUBLIC_API_URL에 설정된 환경 변수를 사용한다", () => {
      expect(apiClient.defaults.baseURL).toBe("http://localhost:8080");
    });
  });
});
