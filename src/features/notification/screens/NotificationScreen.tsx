import { Header } from "@/shared/components/Header/Header";
import React, { Fragment } from "react";
import { Alert } from "react-native";
import { Button, ScrollView, Separator, Text, XStack, YStack } from "tamagui";
import { NotificationItem } from "../components/NotificationItem";
import { useNotificationStore } from "../stores/useNotificationStore";

export function NotificationScreen() {
  const { notifications, markAllAsRead, clearAll } = useNotificationStore();
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.isRead,
  );

  const handleClearAll = () => {
    Alert.alert("알림 전체 삭제", "모든 알림을 삭제할까요?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: clearAll },
    ]);
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="알림" showBackButton showNotificationBell={false} />

      {notifications.length > 0 && (
        <XStack
          px="$4"
          py="$2"
          gap="$2"
          jc="flex-end"
          ai="center"
          borderBottomWidth={1}
          borderColor="$gray3"
          backgroundColor="$background"
        >
          <Button
            chromeless
            size="$2"
            color="$mainText"
            fontFamily="$baemin"
            onPress={markAllAsRead}
            disabled={!hasUnreadNotifications}
            opacity={hasUnreadNotifications ? 1 : 0.4}
          >
            전체 읽음
          </Button>
          <Text color="$mainText">|</Text>
          <Button
            chromeless
            size="$2"
            color="$warning"
            fontFamily="$baemin"
            onPress={handleClearAll}
          >
            전체 삭제
          </Button>
        </XStack>
      )}

      <ScrollView f={1}>
        <YStack>
          {notifications.length > 0 ? (
            notifications.map((item, index) => (
              <Fragment key={item.id}>
                <NotificationItem item={item} />
                {index < notifications.length - 1 && (
                  <Separator borderColor="$gray3" />
                )}
              </Fragment>
            ))
          ) : (
            <YStack f={1} ai="center" jc="center" mt="$10" px="$4">
              <Text color="$gray10" fow="500">
                최근 받은 알림이 없습니다.
              </Text>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
