import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { loginApi, signupApi } from "../api/auth";
import { LoginRequest, LoginResponse, SignupRequest } from "../api/auth.types";
import { useAuthActions } from "../store/useAuthStore";

const useLoginMutation = () => {
  const { setTokens } = useAuthActions();

  return useApiMutation<LoginRequest, LoginResponse>(loginApi, {
    onSuccess: async (res) => {
      if (res.result === "SUCCESS") {
        await setTokens(res);
        Toast.show({
          type: "success",
          text1: "로그인 성공",
          text2: "환영합니다!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "로그인 실패",
          text2: "아이디 또는 비밀번호를 확인해주세요.",
        });
      }
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "오류 발생",
        text2: error.message || "서버와 통신 중 에러가 발생했습니다.",
      });
    },
  });
};

const useSignupMutation = () => {
  const router = useRouter();

  return useApiMutation<SignupRequest, void>(signupApi, {
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "회원가입 완료",
        text2: "로그인 후 이용해주세요!",
      });
      router.replace(`/login`);
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.error?.message;

      Toast.show({
        type: "error",
        text1: "회원가입 실패",
        text2: serverMessage || "입력 정보를 다시 확인해주세요.",
      });
    },
  });
};

export { useLoginMutation, useSignupMutation };
