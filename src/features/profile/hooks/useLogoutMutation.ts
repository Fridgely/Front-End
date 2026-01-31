import { useAuthActions } from "@/features/auth/store/useAuthStore";
import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import Toast from "react-native-toast-message";
import { logoutApi } from "../apis/profile";

const useLogoutMutation = () => {
  const { logout } = useAuthActions();

  return useApiMutation<void, void>(logoutApi, {
    onSuccess: async () => {
      await logout();
      Toast.show({
        type: "success",
        text1: "로그아웃 완료",
        text2: "다음에 또 만나요!",
      });
    },
    onError: async (error: any) => {
      if (error.response?.status === 401) {
        await logout();
        Toast.show({
          type: "success",
          text1: "로그아웃 완료",
          text2: "다음에 또 만나요!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "로그아웃 실패",
          text2: error.message || "서버와 통신 중 에러가 발생했습니다.",
        });
      }
    },
  });
};

export { useLogoutMutation };
