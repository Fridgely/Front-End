import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function CalendarScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="유통기한 캘린더" showBackButton />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Calendar Screen
        </Text>
      </YStack>
    </YStack>
  );
}
