import apiClient from "@/shared/apis/apiClient";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useDeleteFridgeMutation } from "../../hooks/mutations/useDeleteFridgeMutation";

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

describe("useDeleteFridgeMutation 테스트", () => {
  const TEST_FRIDGE_ID = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("냉장고 삭제 성공 시 쿼리 무효화, 상세 캐시 제거, 성공 토스트를 실행해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const removeSpy = jest.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(
      () => useDeleteFridgeMutation(TEST_FRIDGE_ID),
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
        text1: "냉장고가 삭제되었습니다.",
      }),
    );
  });

  it("삭제 실패 시 에러 메시지 토스트를 띄워야 한다", async () => {
    const SERVER_ERROR_MSG = "냉장고 소유자만 삭제할 수 있습니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: { data: { error: { message: SERVER_ERROR_MSG } } },
    });

    const { result } = renderHook(
      () => useDeleteFridgeMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "삭제 실패",
        text2: SERVER_ERROR_MSG,
      }),
    );
  });
});
