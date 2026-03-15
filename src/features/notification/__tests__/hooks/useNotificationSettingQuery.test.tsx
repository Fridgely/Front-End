import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useNotificationSettingQuery } from "../../hooks/queries/useNotificationSettingQuery";

jest.mock("@/shared/apis/apiClient");
const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useNotificationSettingQuery 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("알림 설정 데이터를 성공적으로 가져와야 한다", async () => {
    const mockData = {
      result: "SUCCESS",
      data: {
        notificationTime: "09:00:00",
        daysBeforeExpiration: 3,
        enabled: true,
      },
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useNotificationSettingQuery(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/notifications/settings",
        method: "GET",
      }),
    );
  });

  it("서버 에러 발생 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500, message: "서버 오류" },
    });

    const { result } = renderHook(() => useNotificationSettingQuery(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
  });
});
