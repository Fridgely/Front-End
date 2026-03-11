import apiClient from "@/shared/apis/apiClient";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useUpdateFridgeNameMutation } from "../../hooks/mutations/useUpdateFridgeNameMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

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

describe("useUpdateFridgeNameMutation 테스트", () => {
  const TEST_FRIDGE_ID = 1;
  const mockUpdatePayload = { newName: "우리집 새 냉장고" };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("이름 수정 성공 시 쿼리 무효화와 성공 토스트를 실행해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({
      data: {
        result: "SUCCESS",
        data: { id: TEST_FRIDGE_ID, newName: "우리집 새 냉장고" },
      },
    });
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useUpdateFridgeNameMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate(mockUpdatePayload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        text1: "수정 완료",
      }),
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: QUERY_KEYS.fridge.all }),
    );
  });

  it("서버 에러 발생 시 에러 메시지가 포함된 에러 토스트를 띄워야 한다", async () => {
    const SERVER_ERROR_MSG = "수정 권한이 없습니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: { error: { message: SERVER_ERROR_MSG } },
      },
    });

    const { result } = renderHook(
      () => useUpdateFridgeNameMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate(mockUpdatePayload);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: SERVER_ERROR_MSG,
      }),
    );
  });

  it("요청 시 올바른 URL과 PATCH 메서드, 데이터를 전송해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });

    const { result } = renderHook(
      () => useUpdateFridgeNameMutation(TEST_FRIDGE_ID),
      {
        wrapper,
      },
    );

    result.current.mutate(mockUpdatePayload);

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PATCH",
          url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}`,
          data: mockUpdatePayload,
        }),
      );
    });
  });
});
