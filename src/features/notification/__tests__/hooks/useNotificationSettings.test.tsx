import { act, renderHook } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useUpdateNotificationSettingMutation } from "../../hooks/mutations/useUpdateNotificationSettingMutation";
import { useNotificationSettingQuery } from "../../hooks/queries/useNotificationSettingQuery";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";

jest.mock("../../hooks/queries/useNotificationSettingQuery", () => ({
  useNotificationSettingQuery: jest.fn(),
}));

jest.mock("../../hooks/mutations/useUpdateNotificationSettingMutation", () => ({
  useUpdateNotificationSettingMutation: jest.fn(),
}));

const mockedUseNotificationSettingQuery =
  useNotificationSettingQuery as jest.Mock;
const mockedUseUpdateNotificationSettingMutation =
  useUpdateNotificationSettingMutation as jest.Mock;

describe("useNotificationSettings 테스트", () => {
  const mockMutate = jest.fn();
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  const mockSettings = {
    notificationTime: "09:00:00",
    daysBeforeExpiration: 3,
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockedUseNotificationSettingQuery.mockReturnValue({
      data: { data: mockSettings },
      isLoading: false,
      isError: false,
      error: null,
    });

    mockedUseUpdateNotificationSettingMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it("query의 data.data를 data로 반환하고 isUpdating을 mutation 상태에 매핑해야 한다", () => {
    mockedUseUpdateNotificationSettingMutation.mockReturnValueOnce({
      mutate: mockMutate,
      isPending: true,
    });

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toEqual(mockSettings);
    expect(result.current.isUpdating).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("하나만 변경하여 updateSettings 호출 시 기존 설정을 합쳐셔 mutate를 호출해야 한다", () => {
    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateSettings({ enabled: false });
    });

    expect(mockMutate).toHaveBeenCalledWith({
      notificationTime: "09:00:00",
      daysBeforeExpiration: 3,
      enabled: false,
    });
  });

  it("설정 데이터가 없으면 updateSettings 호출 시 mutate를 호출하지 않아야 한다", () => {
    mockedUseNotificationSettingQuery.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateSettings({ notificationTime: "10:30:00" });
    });

    expect(result.current.data).toBeUndefined();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("여러 필드를 변경해도 빠진 값은 기존 설정으로 유지해서 mutate를 호출해야 한다", () => {
    const { result } = renderHook(() => useNotificationSettings(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.updateSettings({
        notificationTime: "10:30:00",
        daysBeforeExpiration: 1,
      });
    });

    expect(mockMutate).toHaveBeenCalledWith({
      notificationTime: "10:30:00",
      daysBeforeExpiration: 1,
      enabled: true,
    });
  });
});
