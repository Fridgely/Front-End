import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFridgeFoodStatusQuery } from "../../hooks/queries/useFridgeFoodStatusQuery";

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

describe("useFridgeFoodStatusQuery 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("냉장고별 조회 응답을 상태별 데이터로 변환해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({
      data: {
        result: "SUCCESS",
        data: {
          foods: [
            {
              id: 1,
              name: "우유",
              categoryName: "유제품",
              imageURL: "",
              quantity: { amount: 1, unit: "L" },
              condition: {
                expirationDate: "2026-03-20",
                storageType: "REFRIGERATION",
                foodStatus: "RED",
                daysLeft: 1,
              },
            },
            {
              id: 2,
              name: "김치",
              categoryName: "반찬",
              imageURL: "",
              quantity: { amount: 1, unit: "KG" },
              condition: {
                expirationDate: "2026-04-20",
                storageType: "REFRIGERATION",
                foodStatus: "GREEN",
                daysLeft: 30,
              },
            },
          ],
        },
      },
    } as any);

    const { result } = renderHook(() => useFridgeFoodStatusQuery(7), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/refrigerators/7/foods",
        method: "GET",
        params: {
          size: 50,
          sortBy: "EXPIRATION",
        },
      }),
    );

    expect(result.current.data?.data.redCount).toBe(1);
    expect(result.current.data?.data.greenCount).toBe(1);
    expect(result.current.data?.data.blackCount).toBe(0);
    expect(result.current.data?.data.yellowCount).toBe(0);
  });

  it("fridgeId가 없으면 쿼리를 실행하지 않아야 한다", () => {
    const { result } = renderHook(() => useFridgeFoodStatusQuery(null), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("content 키 배열 응답도 정상 변환해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({
      data: {
        result: "SUCCESS",
        data: {
          content: [
            {
              id: 9,
              name: "아이스크림",
              categoryName: "간식",
              imageURL: "",
              quantity: { amount: 2, unit: "PIECE" },
              condition: {
                expirationDate: "2026-03-21",
                storageType: "FROZEN",
                foodStatus: "YELLOW",
                daysLeft: 2,
              },
            },
          ],
        },
      },
    } as any);

    const { result } = renderHook(() => useFridgeFoodStatusQuery(11), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.data.yellowCount).toBe(1);
    expect(result.current.data?.data.yellow[0].id).toBe(9);
  });
});
