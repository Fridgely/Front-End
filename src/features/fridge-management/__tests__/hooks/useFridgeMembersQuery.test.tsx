import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import { useFridgeMembersQuery } from "../../hooks/queries/useFridgeMembersQuery";

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

describe("useFridgeMembersQuery 테스트", () => {
  const TEST_FRIDGE_ID = 1;
  const mockMembersData = {
    result: "SUCCESS",
    data: [
      { memberId: 1, nickname: "주인장", role: "OWNER", isOwner: true },
      { memberId: 2, nickname: "멤버1", role: "MEMBER", isOwner: false },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("올바른 냉장고 ID로 멤버 목록 API를 호출하고 데이터를 반환해야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: mockMembersData });

    const { result } = renderHook(() => useFridgeMembersQuery(TEST_FRIDGE_ID), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}/members`,
      }),
    );

    expect(result.current.data?.data).toHaveLength(2);
    expect(result.current.data?.data[0].nickname).toBe("주인장");
    expect(result.current.data?.data[1].role).toBe("MEMBER");
  });

  it("fridgeId가 0일 경우 enabled 옵션에 의해 API를 호출하지 않아야 한다", async () => {
    const { result } = renderHook(() => useFridgeMembersQuery(0), {
      wrapper,
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockedApiClient).not.toHaveBeenCalled();
  });

  it("API 호출 실패 시 에러 상태를 정확히 반영해야 한다", async () => {
    mockedApiClient.mockRejectedValueOnce(new Error("Fetch Members Failed"));

    const { result } = renderHook(() => useFridgeMembersQuery(TEST_FRIDGE_ID), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });
});
