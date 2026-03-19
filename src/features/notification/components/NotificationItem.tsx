import { formatNotificationTime } from "@/shared/utils/date";
import { Bell } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Circle, Text, XStack, YStack } from "tamagui";
import { useNotificationStore } from "../stores/useNotificationStore";
import type { NotificationItemProps } from "../types";

// 알림 유형에 따른 스타일 (현재는 유통기한)
const NOTIFICATION_CONFIG = {
  icon: Bell,
  color: "$warning",
  bg: "$warningBackground",
  label: "유통기한 임박",
};

export const NotificationItem = ({ item }: { item: NotificationItemProps }) => {
  const router = useRouter();
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const Icon = NOTIFICATION_CONFIG.icon;

  const handlePress = () => {
    markAsRead(item.id);
    if (item.targetScreen === "FOOD_STATUS") {
      router.push("/(tabs)");
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <XStack
        p="$4"
        backgroundColor="$background"
        gap="$3"
        ai="flex-start"
        opacity={item.isRead ? 0.3 : 1}
      >
        <Circle size={40} backgroundColor={NOTIFICATION_CONFIG.bg}>
          <Icon size={20} color={NOTIFICATION_CONFIG.color} />
        </Circle>

        <YStack f={1} gap="$1">
          <XStack jc="space-between" ai="center">
            <Text
              fontSize={12}
              color={NOTIFICATION_CONFIG.color}
              fontWeight="700"
            >
              {NOTIFICATION_CONFIG.label}
            </Text>
            <XStack ai="center" gap="$2">
              <Text fontSize="$3" color="$gray9">
                {formatNotificationTime(item.createdAt)}
              </Text>
              {!item.isRead && <Circle size={6} backgroundColor="$red10" />}
            </XStack>
          </XStack>

          <Text fontSize="$3" fontWeight="700" color="$black" numberOfLines={1}>
            {item.title}
          </Text>
          <Text fontSize="$3" color="$gray10" lineHeight={18}>
            {item.body}
          </Text>
        </YStack>
      </XStack>
    </Pressable>
  );
};
