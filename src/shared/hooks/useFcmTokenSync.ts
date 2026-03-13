import { getFcmToken } from "../lib/fcm/getFcmToken";
import { useFcmMutation } from "./useFcmMutation";

export const useFcmTokenSync = () => {
  const { mutateAsync: registerFcm } = useFcmMutation();

  const syncFcmToken = async () => {
    try {
      const fcmToken = await getFcmToken();
      if (!fcmToken) return;

      await registerFcm({ token: fcmToken });
    } catch (error) {}
  };

  return { syncFcmToken };
};
