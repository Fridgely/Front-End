import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Platform } from "react-native";

const DEFAULT_ANDROID_PACKAGE = "com.chacha.fridgely";

// NOTE: 안드로이드 대상으로만 개발중이므로 ios는 앱 설정 화면으로 이동하도록 구현

const openNotificationSettings = async () => {
  if (Platform.OS === "android") {
    const packageName =
      Constants.expoConfig?.android?.package ?? DEFAULT_ANDROID_PACKAGE;

    try {
      await Linking.sendIntent("android.settings.APP_NOTIFICATION_SETTINGS", [
        {
          key: "android.provider.extra.APP_PACKAGE",
          value: packageName,
        },
      ]);
      return;
    } catch {
      await Linking.openSettings();
      return;
    }
  }

  await Linking.openSettings();
};

export { openNotificationSettings };
