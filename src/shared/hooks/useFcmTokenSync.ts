import { getFcmToken } from "../lib/fcm/getFcmToken";
import { useFcmMutation } from "./useFcmMutation";

export const useFcmTokenSync = () => {
  const { mutateAsync: registerFcm } = useFcmMutation();

  const syncFcmToken = async (token?: string) => {
    try {
      const fcmToken = token ?? (await getFcmToken());
      if (!fcmToken) return;

      await registerFcm({ token: fcmToken });
    } catch (error) {
      // 동기화 실패 시에도 앱이 정상 동작하도록 에러를 무시
      console.error("FCM 토큰 동기화 실패:", error);
      throw error;
    }
  };

  return { syncFcmToken };
};
