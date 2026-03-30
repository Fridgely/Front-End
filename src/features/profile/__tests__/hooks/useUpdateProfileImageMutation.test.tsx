import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { tokenStorage } from "@/shared/lib/tokenStorage/tokenStorage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import React from "react";
import Toast from "react-native-toast-message";
import { useUpdateProfileImageMutation } from "../../hooks/useUpdateProfileImageMutation";
import * as profileImageUtils from "../../utils/getRandomDefaultProfileImage";

jest.mock("@/shared/lib/tokenStorage/tokenStorage", () => ({
  tokenStorage: {
    getAccessToken: jest.fn(),
  },
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

const mockedGetAccessToken = tokenStorage.getAccessToken as jest.Mock;
const mockedToast = Toast.show as jest.Mock;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useUpdateProfileImageMutation 테스트", () => {
  const fetchMock = jest.fn();

  beforeAll(() => {
    global.fetch = fetchMock as any;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    mockedGetAccessToken.mockResolvedValue("test-access-token");
    jest
      .spyOn(profileImageUtils, "clearSavedProfileImage")
      .mockResolvedValue(undefined);
  });

  afterAll(() => {
    queryClient.clear();
  });

  it("업로드 성공 시 fetch 호출, 캐시 무효화, 성공 토스트를 실행해야 한다", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn(),
    });

    const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(
      () => useUpdateProfileImageMutation("test-login-id"),
      { wrapper },
    );

    result.current.mutate({
      uri: "file:///tmp/profile.jpg",
      fileName: "profile.jpg",
      mimeType: "image/jpeg",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/members/me/profile-image"),
      expect.objectContaining({
        method: "PATCH",
        headers: expect.objectContaining({
          Authorization: "Bearer test-access-token",
        }),
        body: expect.any(FormData),
      }),
    );

    expect(profileImageUtils.clearSavedProfileImage).toHaveBeenCalledWith(
      "test-login-id",
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: QUERY_KEYS.member.me() }),
    );

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        text1: "프로필 사진 수정 완료",
      }),
    );
  });

  it("anonymous 계정은 업로드 성공 시 저장 이미지 삭제를 호출하지 않아야 한다", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn(),
    });

    const { result } = renderHook(
      () => useUpdateProfileImageMutation("anonymous"),
      { wrapper },
    );

    result.current.mutate({
      uri: "file:///tmp/profile.jpg",
      fileName: "profile.jpg",
      mimeType: "image/jpeg",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(profileImageUtils.clearSavedProfileImage).not.toHaveBeenCalled();
  });

  it("업로드 실패 시 서버 에러 메시지를 토스트로 표시해야 한다", async () => {
    const serverMessage = "파일 업로드에 실패했습니다.";

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: jest.fn().mockResolvedValue({
        error: { message: serverMessage },
      }),
    });

    const { result } = renderHook(
      () => useUpdateProfileImageMutation("test-login-id"),
      { wrapper },
    );

    result.current.mutate({
      uri: "file:///tmp/profile.jpg",
      fileName: "profile.jpg",
      mimeType: "image/jpeg",
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "프로필 사진 수정 실패",
        text2: serverMessage,
      }),
    );
  });
});
