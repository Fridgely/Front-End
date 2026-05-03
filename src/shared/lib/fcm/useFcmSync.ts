import { getMessaging, onTokenRefresh } from "@react-native-firebase/messaging";
import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getFcmToken } from "./getFcmToken";

let fcmSyncTail = Promise.resolve();

let lastSyncedPair: { userId: string; token: string } | null = null;

export const useFcmSync = (
  userId: string | null,
  onSync?: (token: string) => Promise<void>,
) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  const syncFcmToken = useCallback(async (currentUserId: string | null) => {
    if (!currentUserId) {
      lastSyncedPair = null;
      return;
    }

    const run = async () => {
      try {
        const fcmToken = await getFcmToken();
        if (!fcmToken) {
          console.warn("FCM: 토큰을 찾을 수 없음");
          return;
        }

        if (
          lastSyncedPair?.userId === currentUserId &&
          lastSyncedPair?.token === fcmToken
        ) {
          return;
        }

        const register = onSyncRef.current;
        if (register) await register(fcmToken);
        lastSyncedPair = { userId: currentUserId, token: fcmToken };
      } catch (error) {
        console.error("FCM 토큰 동기화 실패:", error);
      }
    };

    fcmSyncTail = fcmSyncTail.then(run).catch((error) => {
      console.error("FCM 토큰 동기화 실패:", error);
    });
    await fcmSyncTail;
  }, []);

  useEffect(() => {
    syncFcmToken(userId);
  }, [userId, syncFcmToken]);

  useEffect(() => {
    // 토큰 갱신
    const messaging = getMessaging();
    const unsubscribe = onTokenRefresh(messaging, (token) => {
      syncFcmToken(userId);
    });
    return unsubscribe;
  }, [userId, syncFcmToken]);

  useEffect(() => {
    // 앱이 포그라운드로 돌아올 때 토큰 동기화
    const subscription = AppState.addEventListener(
      "change",
      async (nextState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          console.log("FCM: 포그라운드 복귀 체크");
          await syncFcmToken(userId);
        }
        appState.current = nextState;
      },
    );
    return () => subscription.remove();
  }, [userId, syncFcmToken]);
};
