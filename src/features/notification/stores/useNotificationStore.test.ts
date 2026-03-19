import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotificationStore } from "./useNotificationStore";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

describe("useNotificationStore 테스트", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();

    useNotificationStore.setState({
      notifications: [],
      pendingNotificationNavigation: false,
    });
  });

  it("addNotification이 새 알림을 추가하고 기본값을 설정해야 한다", () => {
    const { addNotification } = useNotificationStore.getState();

    addNotification({
      title: "유통기한 임박",
      body: "우유가 내일 만료됩니다.",
      targetScreen: "FOOD_STATUS",
      messageId: "msg-1",
    });

    const [notification] = useNotificationStore.getState().notifications;

    expect(useNotificationStore.getState().notifications).toHaveLength(1);
    expect(notification).toMatchObject({
      id: "msg-1",
      title: "유통기한 임박",
      body: "우유가 내일 만료됩니다.",
      targetScreen: "FOOD_STATUS",
      messageId: "msg-1",
      isRead: false,
    });
    expect(notification.createdAt).toBeTruthy();
  });

  it("같은 messageId 알림은 중복 추가되지 않아야 한다", () => {
    const { addNotification } = useNotificationStore.getState();

    addNotification({
      title: "첫 번째",
      body: "첫 번째",
      messageId: "dup-1",
    });
    addNotification({
      title: "두 번째",
      body: "두 번째",
      messageId: "dup-1",
    });

    const notifications = useNotificationStore.getState().notifications;

    expect(notifications).toHaveLength(1);
    expect(notifications[0].title).toBe("첫 번째");
  });

  it("알림은 최신순으로 유지되며 최대 50개까지만 저장되어야 한다", () => {
    const { addNotification } = useNotificationStore.getState();

    for (let index = 0; index < 55; index += 1) {
      addNotification({
        title: `알림-${index}`,
        body: `내용-${index}`,
        messageId: `id-${index}`,
      });
    }

    const notifications = useNotificationStore.getState().notifications;

    expect(notifications).toHaveLength(50);
    expect(notifications[0].messageId).toBe("id-54");
    expect(notifications[49].messageId).toBe("id-5");
  });

  it("markAsRead와 markAllAsRead가 읽음 상태를 올바르게 변경해야 한다", () => {
    const { addNotification, markAsRead, markAllAsRead } =
      useNotificationStore.getState();

    addNotification({ title: "A", body: "A", messageId: "read-1" });
    addNotification({ title: "B", body: "B", messageId: "read-2" });

    markAsRead("read-1");

    let notifications = useNotificationStore.getState().notifications;
    const first = notifications.find((item) => item.id === "read-1");
    const second = notifications.find((item) => item.id === "read-2");

    expect(first?.isRead).toBe(true);
    expect(second?.isRead).toBe(false);

    markAllAsRead();

    notifications = useNotificationStore.getState().notifications;
    expect(notifications.every((item) => item.isRead)).toBe(true);
  });

  it("clearAll이 알림과 pending을 함께 초기화해야 한다", () => {
    const { addNotification, setPendingNotificationNavigation, clearAll } =
      useNotificationStore.getState();

    addNotification({ title: "A", body: "A", messageId: "clear-1" });
    setPendingNotificationNavigation(true);

    clearAll();

    expect(useNotificationStore.getState().notifications).toEqual([]);
    expect(useNotificationStore.getState().pendingNotificationNavigation).toBe(
      false,
    );
  });
});
