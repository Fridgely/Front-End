import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import { Dimensions } from "react-native";

import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { setOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import { useOnboarding } from "./useOnboarding";

jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("@/features/auth/store/useAuthStore", () => ({
  useIsLoggedIn: jest.fn(),
}));
jest.mock("@/shared/lib/onboarding/onboardingStorage", () => ({
  setOnboardingCompleted: jest.fn(),
}));

describe("useOnboarding 테스트", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (setOnboardingCompleted as jest.Mock).mockResolvedValue(undefined);
  });

  it("초기 상태는 index=0, 마지막 슬라이드가 아니다", () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.index).toBe(0);
    expect(result.current.isLastSlide).toBe(false);
  });

  it("onScrollEnd는 스크롤 위치에 맞춰 index를 갱신한다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useOnboarding());

    const width = Dimensions.get("window")?.width ?? 0;
    const x = width > 0 ? width : 0;
    const expectedIndex = width > 0 ? 1 : 0;

    act(() => {
      result.current.onScrollEnd({
        nativeEvent: { contentOffset: { x } },
      });
    });

    await waitFor(() => {
      expect(result.current.index).toBe(expectedIndex);
    });
  });

  it("handleNext는 다음 index로 scrollToIndex를 호출한다", () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useOnboarding());

    const scrollToIndex = jest.fn();
    (result.current.listRef as any).current = { scrollToIndex };

    result.current.handleNext();

    expect(scrollToIndex).toHaveBeenCalledWith(
      expect.objectContaining({ index: 1, animated: true }),
    );
  });

  it("completeAndGoNext는 완료 플래그를 저장하고 로그인 상태에 맞춰 라우팅한다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    const { result } = renderHook(() => useOnboarding());

    await result.current.completeAndGoNext();

    expect(setOnboardingCompleted).toHaveBeenCalledWith(true);
    expect(mockReplace).toHaveBeenCalledWith("/(auth)/login");
  });
});
