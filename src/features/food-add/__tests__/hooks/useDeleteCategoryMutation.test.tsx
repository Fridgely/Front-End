import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useDeleteCategoryMutation } from "@/features/food/hooks/mutations/useDeleteCategoryMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("react-native-toast-message", () => ({ show: jest.fn() }));

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

describe("useDeleteCategoryMutation 테스트", () => {
  const fridgeId = 2008;
  const categoryId = 42;
  const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
    queryClient.getQueryCache().clear();
    queryClient.getMutationCache().clear();
  });

  it("카테고리 삭제 성공 시 쿼리를 무효화하고 성공 토스트를 표시해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useDeleteCategoryMutation(fridgeId), {
      wrapper,
    });

    result.current.mutate({ categoryId });

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `/api/v1/refrigerators/${fridgeId}/categories/${categoryId}`,
          method: "DELETE",
        }),
      );

      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["categories", fridgeId],
      });

      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "success",
          text1: "카테고리 삭제 완료",
        }),
      );
    });
  });

  it("카테고리 삭제 실패 시 에러 메시지를 포함한 토스트를 표시해야 한다", async () => {
    const serverErrorMessage = "삭제할 수 없는 카테고리입니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: {
          error: { message: serverErrorMessage },
        },
      },
    });

    const { result } = renderHook(() => useDeleteCategoryMutation(fridgeId), {
      wrapper,
    });

    result.current.mutate({ categoryId });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "삭제 실패",
          text2: serverErrorMessage,
        }),
      );
    });
  });

  it("에러 메시지가 없을 때 기본 에러 메시지를 표시해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
    });

    const { result } = renderHook(() => useDeleteCategoryMutation(fridgeId), {
      wrapper,
    });

    result.current.mutate({ categoryId });

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "error",
          text1: "삭제 실패",
          text2: "카테고리 삭제 중 오류가 발생했습니다.",
        }),
      );
    });
  });
});
