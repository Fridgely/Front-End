import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function NotificationSettingScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="알림" showBackButton showNotificationBell={false} />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Notification Setting Screen
        </Text>
      </YStack>
    </YStack>
  );
}
