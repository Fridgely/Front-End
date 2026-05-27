import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getOnboardingCompleted,
  setOnboardingCompleted,
} from "./onboardingStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("onboardingStorage 테스트", () => {
  const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOnboardingCompleted", () => {
    it("저장값이 '1'이면 true를 반환한다", async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce("1");

      await expect(getOnboardingCompleted()).resolves.toBe(true);
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        "onboardingCompleted",
      );
    });

    it("저장값이 없거나 '1'이 아니면 false를 반환한다", async () => {
      mockedAsyncStorage.getItem.mockResolvedValueOnce(null);
      await expect(getOnboardingCompleted()).resolves.toBe(false);

      mockedAsyncStorage.getItem.mockResolvedValueOnce("0");
      await expect(getOnboardingCompleted()).resolves.toBe(false);
    });
  });

  describe("setOnboardingCompleted", () => {
    it("true이면 '1'을 저장한다", async () => {
      await setOnboardingCompleted(true);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "onboardingCompleted",
        "1",
      );
    });

    it("false이면 '0'을 저장한다", async () => {
      await setOnboardingCompleted(false);
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "onboardingCompleted",
        "0",
      );
    });
  });
});

