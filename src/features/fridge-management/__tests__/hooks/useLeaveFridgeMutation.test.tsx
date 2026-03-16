import apiClient from "@/shared/apis/apiClient";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useLeaveFridgeMutation } from "../../hooks/mutations/useLeaveFridgeMutation";

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

describe("useLeaveFridgeMutation 테스트", () => {
  const TEST_FRIDGE_ID = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("냉장고 나가기 성공 시 올바른 캐시 처리와 토스트를 표시해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const removeSpy = jest.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(
      () => useLeaveFridgeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: QUERY_KEYS.fridge.list() }),
    );
    expect(removeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: QUERY_KEYS.fridge.detail(TEST_FRIDGE_ID),
      }),
    );
    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        text1: "냉장고 나가기 완료",
      }),
    );
  });

  it("냉장고 나가기 실패 시 서버 에러 메시지를 토스트로 표시해야 한다", async () => {
    const SERVER_ERROR_MSG = "냉장고를 나갈 수 없습니다.";

    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: {
          error: { message: SERVER_ERROR_MSG },
        },
      },
    });

    const { result } = renderHook(
      () => useLeaveFridgeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(mockedToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "실패",
          text2: SERVER_ERROR_MSG,
        }),
      );
    });
  });

  it("서버 응답에 메시지가 없는 경우 기본 에러 메시지를 표시해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
    });

    const { result } = renderHook(
      () => useLeaveFridgeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => {
      expect(mockedToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "실패",
          text2: "냉장고를 나가는 중 오류가 발생했습니다.",
        }),
      );
    });
  });
});
