import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { useAddFoodMutation } from "../../hooks/mutations/useAddFoodMutation";

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

describe("useAddFoodMutation 테스트", () => {
  const TEST_FRIDGE_ID = 123;
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
    name: "우유",
    categoryId: 1,
    amount: 1.5,
    unit: "L",
    expirationDate: new Date("2026-02-14T10:00:00Z"),
    storageType: "REFRIGERATION",
    description: "테스트 메모",
    imageURL: "file:///test/path/image.jpg",
  };

  it("성공 시 쿼리 무효화, 성공 토스트를 실행하고 뒤로가기가 가능하면 back을 호출한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });
    mockCanGoBack.mockReturnValue(true);
    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useAddFoodMutation(TEST_FRIDGE_ID), {
      wrapper,
    });

    result.current.mutate(mockFormValues as any);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: "success", text1: "식품 등록 완료" }),
    );

    expect(invalidateSpy).toHaveBeenCalled();

    expect(mockBack).toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("뒤로가기가 불가능한 경우 replace를 통해 메인 탭으로 이동한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });
    mockCanGoBack.mockReturnValue(false); // 뒤로가기 불가능 상황

    const { result } = renderHook(() => useAddFoodMutation(TEST_FRIDGE_ID), {
      wrapper,
    });
    result.current.mutate(mockFormValues as any);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("서버 에러 발생 시 에러 메시지가 포함된 토스트를 띄워야 한다", async () => {
    const SERVER_ERROR_MSG = "파일 업로드에 실패했습니다.";
    mockedApiClient.mockRejectedValueOnce({
      response: {
        data: { error: { message: SERVER_ERROR_MSG } },
      },
    });

    const { result } = renderHook(() => useAddFoodMutation(TEST_FRIDGE_ID), {
      wrapper,
    });
    result.current.mutate(mockFormValues as any);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text2: SERVER_ERROR_MSG,
      }),
    );
  });

  it("요청 시 FormData로 전송되어야 한다", async () => {
    mockedApiClient.mockResolvedValueOnce({ data: { result: "SUCCESS" } });

    const { result } = renderHook(() => useAddFoodMutation(TEST_FRIDGE_ID), {
      wrapper,
    });
    result.current.mutate(mockFormValues as any);

    await waitFor(() => {
      expect(mockedApiClient).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          data: expect.any(FormData),
        }),
      );
    });
  });
});
