import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useGenerateInviteCodeMutation } from "../../hooks/mutations/useGenerateInviteCodeMutation";

jest.mock("@/shared/apis/apiClient");
const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useGenerateInviteCodeMutation 테스트", () => {
  const TEST_FRIDGE_ID = 1;
  const mockResponse = {
    result: "SUCCESS",
    data: {
      code: "ABC12345",
      expirationAt: "2026-12-31T23:59:59",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("호출 시 올바른 URL과 POST 메서드를 사용하여 초대 코드를 생성해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(
      () => useGenerateInviteCodeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}/invitation-codes`,
      }),
    );

    expect(result.current.data?.data.code).toBe("ABC12345");
  });

  it("서버 에러 발생 시 isError 상태가 true가 되어야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: { error: { message: "권한이 없습니다." } },
      },
    });

    const { result } = renderHook(
      () => useGenerateInviteCodeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
