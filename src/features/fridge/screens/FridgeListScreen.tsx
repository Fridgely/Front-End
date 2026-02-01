import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function FridgeListScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="냉장고 관리" showBackButton />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Fridge List Screen
        </Text>
      </YStack>
    </YStack>
  );
}
