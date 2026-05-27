import apiClient from "@/shared/apis/apiClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";
import { useAuthActions } from "../store/useAuthStore";
import { useLoginMutation, useSignupMutation } from "./useAuthMutation";

jest.mock("@/shared/apis/apiClient");
jest.mock("react-native-toast-message", () => ({ show: jest.fn() }));
jest.mock("expo-router", () => ({ useRouter: jest.fn() }));
jest.mock("../store/useAuthStore", () => ({ useAuthActions: jest.fn() }));
jest.mock("@/shared/lib/loginIdStorage/loginIdStorage", () => ({
  setLastLoginId: jest.fn(),
  getRememberLoginIdEnabled: jest.fn(() => Promise.resolve(true)),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

// mutation 훅을 테스트하기 위한 QueryClient 및 Provider 설정
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useAuthMutation 테스트", () => {
  const mockReplace = jest.fn();
  const mockSetTokens = jest.fn();
  const { setLastLoginId } = jest.requireMock(
    "@/shared/lib/loginIdStorage/loginIdStorage",
  ) as { setLastLoginId: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useAuthActions as jest.Mock).mockReturnValue({ setTokens: mockSetTokens });
  });

  afterAll(() => {
    queryClient.clear();
    queryClient.getQueryCache().clear();
    queryClient.getMutationCache().clear();
  });

  describe("useLoginMutation 테스트", () => {
    it("로그인 성공 시 받은 토큰을 저장해야 한다", async () => {
      const successResponse = {
        result: "SUCCESS",
        accessToken: "access_token",
        refreshToken: "refresh_token",
      };
      mockedApiClient.mockResolvedValueOnce({ data: successResponse });

      const { result } = renderHook(() => useLoginMutation(), { wrapper });

      const loginData = { loginId: "test_user", password: "test_password" };
      result.current.mutate(loginData);

      // 비동기 로직 완료 대기
      await waitFor(() => {
        expect(mockSetTokens).toHaveBeenCalledWith(successResponse);
        expect(setLastLoginId).toHaveBeenCalledWith(loginData.loginId);
        expect(Toast.show).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "success",
            text1: "로그인 성공",
          }),
        );
        expect(mockedApiClient).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/api/v1/auth/login",
            method: "POST",
            data: loginData,
          }),
        );
      });
    });

    it("로그인 실패 시 에러 토스트 메세지를 보여줘야 한다", async () => {
      mockedApiClient.mockResolvedValueOnce({ data: { result: "FAIL" } });

      const { result } = renderHook(() => useLoginMutation(), { wrapper });
      result.current.mutate({ loginId: "test", password: "pwd" });

      await waitFor(() => {
        expect(mockSetTokens).not.toHaveBeenCalled();
        expect(setLastLoginId).not.toHaveBeenCalled();
        expect(Toast.show).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "error",
            text1: "로그인 실패",
          }),
        );
      });
    });
  });

  describe("useSignupMutation 테스트", () => {
    it("회원가입 성공 시 페이지를 이동해야 한다", async () => {
      mockedApiClient.mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useSignupMutation(), { wrapper });
      const signupData = {
        loginId: "test_user",
        password: "test_password",
        nickname: "test_nickname",
      };
      result.current.mutate(signupData);

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith(
          expect.objectContaining({
            text1: "회원가입 완료",
          }),
        );
        expect(mockReplace).toHaveBeenCalledWith("/login");
        expect(mockedApiClient).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "/api/v1/members",
            method: "POST",
            data: signupData,
          }),
        );
      });
    });

    it("회원가입 실패 시 서버 에러 메시지를 우선적으로 보여줘야 한다", async () => {
      const serverErrorMessage = "이미 존재하는 아이디입니다";
      mockedApiClient.mockRejectedValueOnce({
        response: { data: { error: { message: serverErrorMessage } } },
      });

      const { result } = renderHook(() => useSignupMutation(), { wrapper });
      result.current.mutate({
        loginId: "test_user",
        password: "test_password",
        nickname: "test_nickname",
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledWith(
          expect.objectContaining({
            text2: serverErrorMessage,
          }),
        );
      });
    });
  });
});
