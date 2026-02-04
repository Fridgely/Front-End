import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFoodStatusQuery } from "../../hooks/queries/useFoodStatusQuery";

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

describe("useFoodStatusQuery 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("fridgeId가 선택되면 음식 상태 데이터를 성공적으로 가져와야 한다", async () => {
    const mockData = {
      result: "SUCCESS",
      data: {
        BLACK: [
          {
            id: 1,
            name: "우유",
            categoryName: "유제품",
            imageURL: "",
            quantity: { amount: 1, unit: "L" },
            condition: {
              expirationDate: "2026-02-10",
              storageType: "REFRIGERATOR",
              foodStatus: "BLACK",
              daysLeft: 5,
            },
          },
        ],
        RED: [],
        YELLOW: [],
        GREEN: [],
      },
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFoodStatusQuery(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/foods/status",
        method: "GET",
      }),
    );
  });

  it("fridgeId가 0(또는 null)일 경우 쿼리가 enabled: false로 되어야 한다", async () => {
    const { result } = renderHook(() => useFoodStatusQuery(0), { wrapper });

    // fetchStatus가 idle이면 API 요청을 보내지 않은 것
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("서버 에러 발생 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
      message: "서버 에러",
    });

    const { result } = renderHook(() => useFoodStatusQuery(1), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    // 쿼리에 에러정보가 담겨있는지 확인
    expect(result.current.error).toBeDefined();
  });
});
