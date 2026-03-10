import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { useJoinFridgeByInviteCodeMutation } from "../../hooks/mutations/useJoinFridgeByInviteCodeMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("react-native-toast-message", () => ({ show: jest.fn() }));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedUseRouter = useRouter as jest.Mock;
const mockedReplace = jest.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useJoinFridgeByInviteCodeMutation 테스트", () => {
  const TEST_CODE = "ABC12345";
  const mockSuccessResponse = {
    result: "SUCCESS",
    data: "냉장고 참여에 성공했습니다.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    mockedUseRouter.mockReturnValue({ replace: mockedReplace });
  });

  it("초대 코드와 함께 API 호출이 성공하면 토스트를 띄우고 메인페이지로 이동해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: mockSuccessResponse });
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useJoinFridgeByInviteCodeMutation(), {
      wrapper,
    });

    result.current.mutate({ code: TEST_CODE });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: "/api/v1/refrigerators/invitation-codes/join",
        data: { code: TEST_CODE },
      }),
    );

    expect(invalidateSpy).toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success", text1: "냉장고 참여 완료!" }),
    );
    expect(mockedReplace).toHaveBeenCalledWith("/(tabs)");
  });

  it("API 호출이 실패하면 서버에서 내려준 에러 메시지로 토스트를 띄워야 한다", async () => {
    const serverErrorMessage = "이미 참여 중인 냉장고입니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: {
          error: { message: serverErrorMessage },
        },
      },
    });

    const { result } = renderHook(() => useJoinFridgeByInviteCodeMutation(), {
      wrapper,
    });

    result.current.mutate({ code: TEST_CODE });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ type: "error", text1: serverErrorMessage }),
    );
    expect(mockedReplace).not.toHaveBeenCalled();
  });
});
