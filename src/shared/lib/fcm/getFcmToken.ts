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
  } catch {
    return null;
  }
};
