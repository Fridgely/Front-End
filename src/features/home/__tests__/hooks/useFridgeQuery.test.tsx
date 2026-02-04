import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFridgeQuery } from "../../hooks/queries/useFridgeQuery";

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

describe("useFridgeQuery 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("냉장고 목록을 성공적으로 가져와야 한다", async () => {
    const mockData = {
      result: "SUCCESS",
      data: [
        { id: 1, name: "우리집 냉장고", role: "OWNER", isOwner: true },
        { id: 2, name: "자취방 냉장고", role: "MEMBER", isOwner: false },
      ],
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useFridgeQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/api/v1/refrigerators",
        method: "GET",
      }),
    );
  });

  it("냉장고 목록이 비어있을 때 빈 배열을 반환해야 한다", async () => {
    const mockEmptyData = {
      result: "SUCCESS",
      data: [],
    };

    mockedApiClient.mockResolvedValueOnce({ data: mockEmptyData });

    const { result } = renderHook(() => useFridgeQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data!.data).toHaveLength(0);
  });

  it("서버 에러 발생 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce({
      response: { status: 500 },
    });

    const { result } = renderHook(() => useFridgeQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
  });
});
