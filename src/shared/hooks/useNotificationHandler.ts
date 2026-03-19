import { useIsAuthLoaded } from "@/features/auth/store/useAuthStore";
import { useNotificationStore } from "@/features/notification/stores/useNotificationStore";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { useCallback, useEffect, useRef } from "react";

export const useNotificationHandler = (isLoggedIn: boolean) => {
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );
  const isAuthLoaded = useIsAuthLoaded();
  const pendingInitialNotificationRef =
    useRef<FirebaseMessagingTypes.RemoteMessage | null>(null);
  const consumedInitialNotificationRef = useRef(false);

  const addRemoteMessageToStore = useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      const targetScreen = remoteMessage.data?.target_screen;

      if (remoteMessage.notification) {
        addNotification({
          title: remoteMessage.notification.title || "유통기한 임박",
          body: remoteMessage.notification.body || "",
          targetScreen:
            typeof targetScreen === "string" ? targetScreen : undefined,
          messageId: remoteMessage.messageId ?? undefined,
        });
      }
    },
    [addNotification],
  );

  const handleRemoteMessage = useCallback(
    (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      addRemoteMessageToStore(remoteMessage);
    },
    [addRemoteMessageToStore],
  );

  useEffect(() => {
    const messaging = getMessaging();
    let isMounted = true;

    getInitialNotification(messaging).then((remoteMessage) => {
      if (!isMounted || !remoteMessage) return;

      console.log("종료 상태에서 알림으로 진입:", remoteMessage.data);
      pendingInitialNotificationRef.current = remoteMessage;
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !isAuthLoaded) return;
    if (consumedInitialNotificationRef.current) return;

    const remoteMessage = pendingInitialNotificationRef.current;
    if (!remoteMessage) return;

    consumedInitialNotificationRef.current = true;
    handleRemoteMessage(remoteMessage);
    pendingInitialNotificationRef.current = null;
  }, [isLoggedIn, isAuthLoaded, handleRemoteMessage]);

  useEffect(() => {
    // 로그인 상태가 아니면 리스너를 등록하지 않음
    if (!isLoggedIn || !isAuthLoaded) return;

    const messaging = getMessaging();

    // 포어그라운드
    const unsubscribeForeground = onMessage(messaging, (remoteMessage) => {
      addRemoteMessageToStore(remoteMessage);
    });

    // 백그라운드에서 알림 클릭
    const unsubscribeNotificationOpen = onNotificationOpenedApp(
      messaging,
      (remoteMessage) => {
        handleRemoteMessage(remoteMessage);
      },
    );

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpen();
    };
  }, [isLoggedIn, isAuthLoaded, addRemoteMessageToStore, handleRemoteMessage]);
};
