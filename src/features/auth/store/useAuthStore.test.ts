import { tokenStorage } from "@/lib/tokenStorage/tokenStorage";
import { useAuthStore } from "./useAuthStore";

jest.mock("@/lib/tokenStorage/tokenStorage", () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
    setAccessToken: jest.fn(),
    getRefreshToken: jest.fn(),
    setRefreshToken: jest.fn(),
    clear: jest.fn(),
  },
}));

describe("AuthStore 테스트", () => {
  // 테스트마다 스토어 상태 초기화
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      accessToken: null,
      isLoggedIn: false,
      isLoaded: false,
    });
  });

  it("setTokens 액션이 상태를 변경하고 저장한다.", async () => {
    const mockStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
    const { setTokens } = useAuthStore.getState().actions;

    await setTokens({
      result: "SUCCESS",
      accessToken: "test_access",
      refreshToken: "test_refresh",
    });

    expect(mockStorage.setAccessToken).toHaveBeenCalledWith("test_access");
    expect(mockStorage.setRefreshToken).toHaveBeenCalledWith("test_refresh");
    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe("test_access");
  });

  it("hydrate 액션이 저장된 토큰을 읽어와서 복구한다", async () => {
    const mockStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
    mockStorage.getAccessToken.mockResolvedValue("saved_token");

    const { hydrate } = useAuthStore.getState().actions;
    await hydrate();

    expect(useAuthStore.getState().isLoggedIn).toBe(true);
    expect(useAuthStore.getState().accessToken).toBe("saved_token");
  });

  it("logout 액션이 토큰을 삭제하고 상태를 초기화한다", async () => {
    const mockStorage = tokenStorage as jest.Mocked<typeof tokenStorage>;
    const { logout } = useAuthStore.getState().actions;

    await logout();

    expect(mockStorage.clear).toHaveBeenCalled();
    expect(useAuthStore.getState().isLoggedIn).toBe(false);
    expect(useAuthStore.getState().accessToken).toBe(null);
  });
});
