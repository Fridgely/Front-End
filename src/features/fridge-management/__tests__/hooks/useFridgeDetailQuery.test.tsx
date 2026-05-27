import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFridgeDetailQuery } from "../../hooks/queries/useFridgeDetailQuery";

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

describe("useFridgeDetailQuery 테스트", () => {
  const TEST_ID = 123;
  const mockDetailData = {
    result: "SUCCESS",
    data: {
      id: TEST_ID,
      name: "테스트 냉장고",
      role: "OWNER",
      isOwner: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("올바른 ID로 API를 호출하고 데이터를 반환해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: mockDetailData });

    const { result } = renderHook(() => useFridgeDetailQuery(TEST_ID), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `/api/v1/refrigerators/${TEST_ID}`,
      }),
    );

    expect(result.current.data?.data.name).toBe("테스트 냉장고");
    expect(result.current.data?.data.isOwner).toBe(true);
  });

  it("ID가 0이거나 없을 경우 API를 호출하지 않아야 한다 (enabled 옵션)", async () => {
    const { result } = renderHook(() => useFridgeDetailQuery(0), {
      wrapper,
    });

    // enabled가 false 상태이므로 fetchStatus가 'idle'이어야 함
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("API 호출 실패 시 에러 상태를 반환해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useFridgeDetailQuery(TEST_ID), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
