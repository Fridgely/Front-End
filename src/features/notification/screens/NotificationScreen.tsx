import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function NotificationScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="알림" showBackButton showNotificationBell={false} />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Notification Screen
        </Text>
      </YStack>
    </YStack>
  );
}
