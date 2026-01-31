import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function ProfileScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="마이페이지" showBackButton />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Profile Screen
        </Text>
      </YStack>
    </YStack>
  );
}
