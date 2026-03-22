import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFoodDetailQuery } from "../../hooks/queries/useFoodDetailQuery";

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

describe("useFoodDetailQuery 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("refrigeratorId와 foodId가 있으면 상세 데이터를 성공적으로 가져와야 한다", async () => {
    const mockData = {
      result: "SUCCESS",
      data: {
        id: 456,
        refrigeratorId: 123,
        name: "우유",
        categoryName: "유제품",
        description: "유기농 우유",
        imageURL: "https://example.com/images/milk.jpg",
        quantity: {
          amount: 1.5,
          unit: "L",
        },
        condition: {
          expirationDate: "2026-01-15T00:00:00",
          storageType: "REFRIGERATION",
          foodStatus: "GREEN",
          daysLeft: 7,
        },
      },
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFoodDetailQuery(123, 456), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/refrigerators/123/foods/456",
        method: "GET",
      }),
    );
  });

  it("refrigeratorId 또는 foodId가 없으면 쿼리가 실행되지 않아야 한다", () => {
    const { result } = renderHook(() => useFoodDetailQuery(null, 9), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("API 호출 실패 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 400, message: "잘못된 요청" },
    });

    const { result } = renderHook(() => useFoodDetailQuery(3, 9), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
