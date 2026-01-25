import { Header } from "@/shared/components/Header/Header";
import { Text, YStack } from "tamagui";

export function SearchScreen() {
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="검색" />

      <YStack f={1} jc="center" ai="center">
        <Text fontSize="$6" fontWeight="bold">
          Search Screen
        </Text>
      </YStack>
    </YStack>
  );
}
