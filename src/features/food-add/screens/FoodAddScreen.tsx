import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function FoodAddScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품추가" showBackButton />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Food Add Screen
        </Text>
      </YStack>
    </YStack>
  );
}
