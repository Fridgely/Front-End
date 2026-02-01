import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useAuthActions } from "@/features/auth/store/useAuthStore";
import { useLogoutMutation } from "./useLogoutMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("react-native-toast-message", () => ({ show: jest.fn() }));
jest.mock("@/features/auth/store/useAuthStore");

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useLogoutMutation 테스트", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    // useAuthActions가 호출될 때 mockLogout 함수를 반환하도록 설정
    (useAuthActions as jest.Mock).mockReturnValue({ logout: mockLogout });
  });

  afterAll(() => {
    queryClient.clear();
    queryClient.getQueryCache().clear();
    queryClient.getMutationCache().clear();
  });

  it("로그아웃 성공 시 logout을 호출하고 성공 토스트를 표시해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          text1: "로그아웃 완료",
        }),
      );
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "/api/v1/auth/logout",
          method: "POST",
        }),
      );
    });
  });

  it("401 에러 발생 시 logout을 호출하고 성공 토스트를 표시해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 401 },
    });

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          text1: "로그아웃 완료",
        }),
      );
    });
  });

  it("401이 아닌 에러 발생 시 에러 토스트를 표시해야 한다", async () => {
    const errorMessage = "서버 에러";
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
      message: errorMessage,
    });

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(mockLogout).not.toHaveBeenCalled();
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "로그아웃 실패",
          text2: errorMessage,
        }),
      );
    });
  });

  it("에러 메시지가 없을 때 기본 메시지를 표시해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
    });

    const { result } = renderHook(() => useLogoutMutation(), { wrapper });

    result.current.mutate();

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "로그아웃 실패",
          text2: "서버와 통신 중 에러가 발생했습니다.",
        }),
      );
    });
  });
});
