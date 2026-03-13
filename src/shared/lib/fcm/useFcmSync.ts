import { getMessaging, onTokenRefresh } from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getFcmToken } from "./getFcmToken";

export const useFcmSync = (
  userId: string | null,
  onSync?: () => Promise<void>,
) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastSyncRef = useRef<{ token: string; userId: string | null }>({
    token: "",
    userId: null,
  });

  const syncFcmToken = async (currentUserId: string | null) => {
    if (!currentUserId) {
      // 사용자 미로그인 상태
      return;
    }

    try {
      const fcmToken = await getFcmToken();
      if (!fcmToken) {
        console.warn("FCM: 토큰을 찾을 수 없음");
        return;
      }

      const prevToken = lastSyncRef.current.token;
      const prevUserId = lastSyncRef.current.userId;

      if (fcmToken !== prevToken || currentUserId !== prevUserId) {
        // 토큰 또는 사용자 ID가 변경된 경우에만 서버에 동기화
        lastSyncRef.current = { token: fcmToken, userId: currentUserId };
        if (onSync) await onSync();
      } else {
        // 토큰과 사용자 ID 모두 변경되지 않음
      }
    } catch (error) {
      // 동기화 실패 시에도 앱이 정상 동작하도록 에러를 무시
      console.error("FCM 토큰 동기화 실패:", error);
    }
  };

  useEffect(() => {
    syncFcmToken(userId);
  }, [userId]);

  useEffect(() => {
    // 토큰 갱신
    const messaging = getMessaging();
    const unsubscribe = onTokenRefresh(messaging, (token) => {
      syncFcmToken(userId);
    });
    return unsubscribe;
  }, [userId]);

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
  }, [userId]);
};
