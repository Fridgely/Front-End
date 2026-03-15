import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import { openNotificationSettings } from "./openNotificationSettings";

// NOTE: 안드로이드 대상으로 테스트

jest.mock("expo-linking", () => ({
  openSettings: jest.fn(),
  sendIntent: jest.fn(),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      android: {
        package: "com.test.app",
      },
    },
  },
}));

const mockedLinking = Linking as jest.Mocked<typeof Linking>;
const mockedConstants = Constants as unknown as {
  expoConfig?: {
    android?: {
      package?: string;
    };
  };
};

const originalOS = Platform.OS;

const setPlatformOS = (os: "android") => {
  Object.defineProperty(Platform, "OS", {
    configurable: true,
    value: os,
  });
};

describe("openNotificationSettings 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConstants.expoConfig = {
      android: {
        package: "com.test.app",
      },
    };
    mockedLinking.sendIntent.mockResolvedValue(undefined);
    mockedLinking.openSettings.mockResolvedValue(undefined);
    setPlatformOS("android");
  });

  afterAll(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      value: originalOS,
    });
  });

  it("Android에서는 앱 알림 설정 화면으로 이동해야 한다", async () => {
    await openNotificationSettings();

    expect(mockedLinking.sendIntent).toHaveBeenCalledWith(
      "android.settings.APP_NOTIFICATION_SETTINGS",
      [
        {
          key: "android.provider.extra.APP_PACKAGE",
          value: "com.test.app",
        },
      ],
    );
    expect(mockedLinking.openSettings).not.toHaveBeenCalled();
  });

  it("Android에서 패키지 정보가 없으면 기본 패키지명으로 이동해야 한다", async () => {
    mockedConstants.expoConfig = undefined;

    await openNotificationSettings();

    expect(mockedLinking.sendIntent).toHaveBeenCalledWith(
      "android.settings.APP_NOTIFICATION_SETTINGS",
      [
        {
          key: "android.provider.extra.APP_PACKAGE",
          value: "com.chacha.fridgely",
        },
      ],
    );
  });

  it("Android에서 알림 설정 화면 이동이 실패하면 앱 설정 화면으로 fallback 해야 한다", async () => {
    mockedLinking.sendIntent.mockRejectedValueOnce(new Error("intent error"));

    await openNotificationSettings();

    expect(mockedLinking.sendIntent).toHaveBeenCalled();
    expect(mockedLinking.openSettings).toHaveBeenCalled();
  });
});
