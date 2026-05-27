import apiClient from "@/shared/apis/apiClient";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useDeleteFoodMutation } from "../../hooks/mutations/useDeleteFoodMutation";

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

describe("useDeleteFoodMutation 테스트", () => {
  const TEST_FRIDGE_ID = 123;
  const TEST_FOOD_ID = 456;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("식품 삭제 성공 시 API 호출, 쿼리 무효화, 캐시 제거, 성공 토스트를 실행해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({
      data: { result: "SUCCESS" },
    } as any);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
    const removeSpy = jest.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteFoodMutation(), {
      wrapper,
    });

    result.current.mutate({ fridgeId: TEST_FRIDGE_ID, foodId: TEST_FOOD_ID });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}/foods/${TEST_FOOD_ID}`,
      }),
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: QUERY_KEYS.food.all }),
    );

    expect(removeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: QUERY_KEYS.food.detail(TEST_FRIDGE_ID, TEST_FOOD_ID),
      }),
    );

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        text1: "식품 삭제 완료",
      }),
    );
  });

  it("식품 삭제 실패 시 서버 에러 메시지 토스트를 표시해야 한다", async () => {
    const SERVER_ERROR_MSG = "삭제 권한이 없습니다.";

    mockedApiClient.mockRejectedValueOnce({
      response: { data: { error: { message: SERVER_ERROR_MSG } } },
    });

    const { result } = renderHook(() => useDeleteFoodMutation(), {
      wrapper,
    });

    result.current.mutate({ fridgeId: TEST_FRIDGE_ID, foodId: TEST_FOOD_ID });

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
