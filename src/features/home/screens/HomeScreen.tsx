import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function HomeScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Home Screen
        </Text>
      </YStack>
    </YStack>
  );
}
