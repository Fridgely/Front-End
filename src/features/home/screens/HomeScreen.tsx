import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function HomeScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="나의 냉장고" showNotificationBell />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Home Screen
        </Text>
      </YStack>
    </YStack>
  );
}
