import apiClient from "@/shared/apis/apiClient";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useUpdateNotificationSettingMutation } from "../../hooks/mutations/useUpdateNotificationSettingMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("react-native-toast-message", () => ({ show: jest.fn() }));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedToast = Toast.show as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useUpdateNotificationSettingMutation 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
    queryClient.getQueryCache().clear();
    queryClient.getMutationCache().clear();
  });

  it("설정 업데이트 성공 시 쿼리를 무효화해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: {} });
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useUpdateNotificationSettingMutation(),
      {
        wrapper,
      },
    );

    const updatePayload = {
      notificationTime: "10:30:00",
      daysBeforeExpiration: 3,
      enabled: false,
    };
    result.current.mutate(updatePayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/notifications/settings",
        method: "PATCH",
        data: updatePayload,
      }),
    );

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS.notification.settings(),
    });
  });

  it("설정 업데이트 실패 시 에러 토스트를 표시해야 한다", async () => {
    const serverErrorMessage = "시간 형식이 올바르지 않습니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: {
          error: { message: serverErrorMessage },
        },
      },
    });

    const { result } = renderHook(
      () => useUpdateNotificationSettingMutation(),
      {
        wrapper,
      },
    );

    result.current.mutate({
      notificationTime: "wrong-time",
      daysBeforeExpiration: 3,
      enabled: true,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "설정 업데이트 실패",
        text2: serverErrorMessage,
      }),
    );
  });

  it("에러 메시지가 없을 때 기본 에러 메시지를 토스트에 표시해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 400 },
    });

    const { result } = renderHook(
      () => useUpdateNotificationSettingMutation(),
      {
        wrapper,
      },
    );

    result.current.mutate({
      notificationTime: "09:00:00",
      daysBeforeExpiration: 1,
      enabled: true,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "설정 업데이트 실패",
        text2: "알림 설정 업데이트 중 오류가 발생했습니다.",
      }),
    );
  });
});
