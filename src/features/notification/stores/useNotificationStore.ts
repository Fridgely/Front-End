import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NotificationItemProps } from "../types";

interface NotificationState {
  notifications: NotificationItemProps[];
  pendingNotificationNavigation: boolean;
  addNotification: (
    notification: Omit<NotificationItemProps, "id" | "createdAt" | "isRead">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  setPendingNotificationNavigation: (value: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      pendingNotificationNavigation: false,

      setPendingNotificationNavigation: (value) =>
        set({ pendingNotificationNavigation: value }),

      // 새 알림 추가 (최신순 정렬)
      addNotification: (content) =>
        set((state) => {
          // messageId 기반 중복 체크
          const isDuplicateId =
            content.messageId &&
            state.notifications.some((n) => n.messageId === content.messageId);

          //  아이디가 없는 경우를 대비해 제목과 내용으로 한 번 더 체크
          const isDuplicateContent =
            !content.messageId &&
            state.notifications.some(
              (n) => n.title === content.title && n.body === content.body,
            );

          if (isDuplicateId || isDuplicateContent) {
            return state;
          }

          const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

          return {
            notifications: [
              {
                ...content,
                id: content.messageId ?? tempId,
                createdAt: new Date().toISOString(),
                isRead: false,
              },
              ...state.notifications,
            ].slice(0, 50),
          };
        }),

      // 특정 알림 읽음 처리
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        })),

      // 모두 읽음 처리
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
        })),

      // 전체 삭제
      clearAll: () =>
        set({ notifications: [], pendingNotificationNavigation: false }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
