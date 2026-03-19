import { useIsAuthLoaded } from "@/features/auth/store/useAuthStore";
import { useNotificationStore } from "@/features/notification/stores/useNotificationStore";
import {
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useNotificationHandler } from "./useNotificationHandler";

jest.mock("@/features/auth/store/useAuthStore", () => ({
  useIsAuthLoaded: jest.fn(),
}));

jest.mock("@/features/notification/stores/useNotificationStore", () => ({
  useNotificationStore: jest.fn(),
}));

jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(),
  getInitialNotification: jest.fn(),
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
}));

describe("useNotificationHandler 테스트", () => {
  const mockedUseIsAuthLoaded = useIsAuthLoaded as jest.Mock;
  const mockedUseNotificationStore =
    useNotificationStore as unknown as jest.Mock;
  const mockedGetMessaging = getMessaging as jest.Mock;
  const mockedGetInitialNotification = getInitialNotification as jest.Mock;
  const mockedOnMessage = onMessage as jest.Mock;
  const mockedOnNotificationOpenedApp = onNotificationOpenedApp as jest.Mock;

  const addNotificationMock = jest.fn();
  const messagingInstance = { appName: "mock-fridge" };

  const createRemoteMessage = (overrides: Record<string, unknown> = {}) =>
    ({
      messageId: "msg-1",
      data: { target_screen: "FOOD_STATUS" },
      notification: {
        title: "유통기한 임박",
        body: "우유가 내일 만료됩니다.",
      },
      ...overrides,
    }) as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});

    mockedUseIsAuthLoaded.mockReturnValue(true);
    mockedUseNotificationStore.mockImplementation((selector) =>
      selector({ addNotification: addNotificationMock }),
    );

    mockedGetMessaging.mockReturnValue(messagingInstance);
    mockedGetInitialNotification.mockResolvedValue(null);
    mockedOnMessage.mockImplementation(() => jest.fn());
    mockedOnNotificationOpenedApp.mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("로그인 또는 auth 로드가 되지 않으면 리스너를 등록하지 않아야 한다", () => {
    mockedUseIsAuthLoaded.mockReturnValue(false);

    renderHook(() => useNotificationHandler(true));
    renderHook(() => useNotificationHandler(false));

    expect(mockedOnMessage).not.toHaveBeenCalled();
    expect(mockedOnNotificationOpenedApp).not.toHaveBeenCalled();
  });

  it("로그인 상태에서는 포그라운드/백그라운드 리스너를 등록하고 언마운트 시 해제해야 한다", () => {
    const unsubscribeForeground = jest.fn();
    const unsubscribeNotificationOpen = jest.fn();

    mockedOnMessage.mockImplementation(() => unsubscribeForeground);
    mockedOnNotificationOpenedApp.mockImplementation(
      () => unsubscribeNotificationOpen,
    );

    const { unmount } = renderHook(() => useNotificationHandler(true));

    expect(mockedOnMessage).toHaveBeenCalledWith(
      messagingInstance,
      expect.any(Function),
    );
    expect(mockedOnNotificationOpenedApp).toHaveBeenCalledWith(
      messagingInstance,
      expect.any(Function),
    );

    unmount();

    expect(unsubscribeForeground).toHaveBeenCalledTimes(1);
    expect(unsubscribeNotificationOpen).toHaveBeenCalledTimes(1);
  });

  it("수신한 메시지를 addNotification payload로 변환해 저장해야 한다", () => {
    let foregroundCallback: ((remoteMessage: any) => void) | undefined;
    let openCallback: ((remoteMessage: any) => void) | undefined;

    mockedOnMessage.mockImplementation((_, callback) => {
      foregroundCallback = callback;
      return jest.fn();
    });

    mockedOnNotificationOpenedApp.mockImplementation((_, callback) => {
      openCallback = callback;
      return jest.fn();
    });

    renderHook(() => useNotificationHandler(true));

    act(() => {
      foregroundCallback?.(createRemoteMessage());
    });

    act(() => {
      openCallback?.(
        createRemoteMessage({
          messageId: "msg-2",
          data: { target_screen: "FOOD_STATUS" },
        }),
      );
    });

    expect(addNotificationMock).toHaveBeenNthCalledWith(1, {
      title: "유통기한 임박",
      body: "우유가 내일 만료됩니다.",
      targetScreen: "FOOD_STATUS",
      messageId: "msg-1",
    });
    expect(addNotificationMock).toHaveBeenNthCalledWith(2, {
      title: "유통기한 임박",
      body: "우유가 내일 만료됩니다.",
      targetScreen: "FOOD_STATUS",
      messageId: "msg-2",
    });
  });

  it("notification 필드가 없으면 저장하지 않아야 한다", () => {
    let foregroundCallback: ((remoteMessage: any) => void) | undefined;

    mockedOnMessage.mockImplementation((_, callback) => {
      foregroundCallback = callback;
      return jest.fn();
    });

    renderHook(() => useNotificationHandler(true));

    act(() => {
      foregroundCallback?.({
        messageId: "msg-empty",
        data: { target_screen: "FOOD_STATUS" },
      });
    });

    expect(addNotificationMock).not.toHaveBeenCalled();
  });

  it("종료 상태 초기 알림은 로그인 전에는 보류되고 로그인 후 한 번만 처리되어야 한다", async () => {
    let resolveInitialNotification: (message: any) => void = () => {};
    let isLoggedIn = false;

    mockedGetInitialNotification.mockReturnValue(
      new Promise((resolve) => {
        resolveInitialNotification = resolve;
      }),
    );

    const { rerender } = renderHook(() => useNotificationHandler(isLoggedIn));

    await act(async () => {
      resolveInitialNotification(
        createRemoteMessage({
          messageId: "msg-initial",
        }),
      );
      await Promise.resolve();
    });

    expect(addNotificationMock).not.toHaveBeenCalled();

    isLoggedIn = true;
    rerender(undefined);

    await waitFor(() => {
      expect(addNotificationMock).toHaveBeenCalledTimes(1);
    });

    rerender(undefined);

    await waitFor(() => {
      expect(addNotificationMock).toHaveBeenCalledTimes(1);
    });
  });
});
