import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useCategoryQuery } from "@/features/food/hooks/queries/useCategoryQuery";

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

describe("useCategoryQuery 테스트", () => {
  const TEST_FRIDGE_ID = 123;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("특정 냉장고의 카테고리 목록을 성공적으로 가져와야 한다", async () => {
    const mockData = {
      result: "SUCCESS",
      data: [
        { id: 1, name: "유제품", isDefaultType: true },
        { id: 2, name: "육류", isDefaultType: true },
      ],
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useCategoryQuery(TEST_FRIDGE_ID), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}/categories`,
        method: "GET",
      }),
    );
  });

  it("fridgeId가 0이거나 없을 경우 쿼리가 실행되지 않아야 한다 ", async () => {
    const { result } = renderHook(() => useCategoryQuery(0), { wrapper });

    // enabled: !!fridgeId 조건으로 인해 fetch가 일어나지 않으므로 status는 'pending' (또는 'idle')
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("카테고리 목록이 비어있을 때 빈 배열을 반환해야 한다", async () => {
    const mockEmptyData = {
      result: "SUCCESS",
      data: [],
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockEmptyData });

    const { result } = renderHook(() => useCategoryQuery(TEST_FRIDGE_ID), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data!.data).toHaveLength(0);
  });

  it("서버 에러 발생 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 404, message: "냉장고를 찾을 수 없습니다." },
    });

    const { result } = renderHook(() => useCategoryQuery(TEST_FRIDGE_ID), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
  });
});
