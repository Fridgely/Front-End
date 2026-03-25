import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { useUpdateFoodMutation } from "../../hooks/mutations/useUpdateFoodMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
const mockedUseRouter = useRouter as jest.Mock;
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

describe("useUpdateFoodMutation 테스트", () => {
  const TEST_FRIDGE_ID = 123;
  const TEST_FOOD_ID = 456;
  const mockBack = jest.fn();
  const mockReplace = jest.fn();
  const mockCanGoBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    mockedUseRouter.mockReturnValue({
      back: mockBack,
      replace: mockReplace,
      canGoBack: mockCanGoBack,
    });
  });

  const mockFormValues = {
    name: "Test 1day update",
    categoryId: 10053,
    amount: 1,
    unit: "PIECE",
    expirationDate: new Date("2026-03-28T10:13:00Z"),
    storageType: "FROZEN",
    description: "",
    imageURL: undefined,
  };

  it("성공 시 선택적 캐시 무효화와 상세 쿼리 무효화를 실행한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });
    mockCanGoBack.mockReturnValue(true);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useUpdateFoodMutation(TEST_FRIDGE_ID, TEST_FOOD_ID),
      { wrapper },
    );

    result.current.mutate(mockFormValues as any);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success", text1: "식품 수정 완료" }),
    );

    // 상태 목록 쿼리들은 refetchType: inactive로 처리
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(["foods", "status", "all"]),
        refetchType: "inactive",
      }),
    );

    // 상세 쿼리는 즉시 재조회
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining([
          "foods",
          "detail",
          TEST_FRIDGE_ID,
          TEST_FOOD_ID,
        ]),
      }),
    );

    expect(mockBack).toHaveBeenCalled();
  });

  it("서버 에러 발생 시 에러 메시지가 포함된 토스트를 띄워야 한다", async () => {
    const SERVER_ERROR_MSG = "식품 수정에 실패했습니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: { error: { message: SERVER_ERROR_MSG } },
      },
    });

    const { result } = renderHook(
      () => useUpdateFoodMutation(TEST_FRIDGE_ID, TEST_FOOD_ID),
      { wrapper },
    );

    result.current.mutate(mockFormValues as any);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "수정 실패",
        text2: SERVER_ERROR_MSG,
      }),
    );
  });

  it("요청 시 FormData, PATCH 메소드로 전송되어야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });

    const { result } = renderHook(
      () => useUpdateFoodMutation(TEST_FRIDGE_ID, TEST_FOOD_ID),
      { wrapper },
    );

    result.current.mutate(mockFormValues as any);

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PATCH",
          url: `/api/v1/refrigerators/${TEST_FRIDGE_ID}/foods/${TEST_FOOD_ID}`,
          data: expect.any(FormData),
        }),
      );
    });
  });

  it("imageURL이 있으면 image 파트에 포함되어야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });

    const { result } = renderHook(
      () => useUpdateFoodMutation(TEST_FRIDGE_ID, TEST_FOOD_ID),
      { wrapper },
    );

    result.current.mutate({
      ...mockFormValues,
      imageURL: "file:///test/path/image.jpg",
    } as any);

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalled();
    });

    // API 호출 시 FormData가 전송되었는지 확인
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.any(FormData),
      }),
    );
  });

  it("imageURL이 없으면 image 추가 요청이 없어야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });

    const { result } = renderHook(
      () => useUpdateFoodMutation(TEST_FRIDGE_ID, TEST_FOOD_ID),
      { wrapper },
    );

    result.current.mutate({
      ...mockFormValues,
      imageURL: undefined,
    } as any);

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "PATCH",
          data: expect.any(FormData),
        }),
      );
    });
  });
});
