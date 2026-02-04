import { View, XStack, YStack } from "tamagui";

// 임시용 스켈레톤
export function HomeSkeleton() {
  return (
    <YStack gap="$5" px="$4" py="$2">
      <XStack gap="$2">
        {[1, 2, 3].map((i) => (
          <View key={i} w={80} h={40} br="$4" bg="$gray3" />
        ))}
      </XStack>

      <View w="100%" h={120} br="$4" bg="$gray3" />

      <YStack gap="$3">
        {[1, 2, 3, 4].map((i) => (
          <XStack key={i} gap="$3" ai="center">
            <View w={60} h={60} br="$2" bg="$gray3" />
            <YStack f={1} gap="$2">
              <View w="40%" h={15} bg="$gray3" />
              <View w="70%" h={15} bg="$gray3" />
            </YStack>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
