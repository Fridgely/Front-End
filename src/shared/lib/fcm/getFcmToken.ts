import {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
} from "@react-native-firebase/messaging";

export const getFcmToken = async () => {
  try {
    const messaging = getMessaging();
    await registerDeviceForRemoteMessages(messaging);
    const token = await getToken(messaging);
    return token || null;
  } catch (error) {
    console.error("FCM Token 발급 중 예외 발생:", error);
    throw error;
  }
};
