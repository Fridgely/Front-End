import { act, render, waitFor } from "@testing-library/react-native";
import { useRouter, useSegments } from "expo-router";

import { useIsLoggedIn } from "@/features/auth/store/useAuthStore";
import { getOnboardingCompleted } from "@/shared/lib/onboarding/onboardingStorage";
import { OnboardingGate } from "./OnboardingProvider";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
}));

jest.mock("@/features/auth/store/useAuthStore", () => ({
  useIsLoggedIn: jest.fn(),
}));

jest.mock("@/shared/lib/onboarding/onboardingStorage", () => ({
  getOnboardingCompleted: jest.fn(),
}));

describe("OnboardingGate 테스트", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it("온보딩이 완료되지 않았고 온보딩 화면이 아니면 /onboarding 으로 이동한다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);
    (getOnboardingCompleted as jest.Mock).mockResolvedValueOnce(false);

    render(<OnboardingGate />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("온보딩이 완료되었고 온보딩 화면에서 로그인 상태면 /(tabs)로 이동한다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(true);
    (useSegments as jest.Mock).mockReturnValue(["onboarding"]);
    (getOnboardingCompleted as jest.Mock).mockResolvedValueOnce(true);

    render(<OnboardingGate />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("온보딩이 완료되었고 온보딩 화면에서 로그아웃 상태면 /(auth)/login으로 이동한다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    (useSegments as jest.Mock).mockReturnValue(["onboarding"]);
    (getOnboardingCompleted as jest.Mock).mockResolvedValueOnce(true);

    render(<OnboardingGate />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/(auth)/login");
    });
  });

  it("온보딩 완료 여부 조회가 실패하면 미완료로 간주하고 온보딩으로 보낸다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    (useSegments as jest.Mock).mockReturnValue(["(tabs)"]);
    (getOnboardingCompleted as jest.Mock).mockRejectedValueOnce(
      new Error("fail"),
    );

    render(<OnboardingGate />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/onboarding");
    });
  });

  it("온보딩 완료 후 로그인 화면이면 스토리지 기준으로 완료로 인식해 온보딩으로 되돌리지 않는다", async () => {
    (useIsLoggedIn as jest.Mock).mockReturnValue(false);
    (useSegments as jest.Mock).mockReturnValue(["(auth)", "login"]);
    (getOnboardingCompleted as jest.Mock).mockResolvedValueOnce(true);

    render(<OnboardingGate />);

    await waitFor(() => {
      expect(getOnboardingCompleted).toHaveBeenCalled();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
