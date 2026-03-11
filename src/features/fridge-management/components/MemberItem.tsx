import { Text, View, XStack, YStack } from "tamagui";
import { FridgeMembersProps } from "../types";

export function MemberItem({ member, isLast }: FridgeMembersProps) {
  const isOwner = member.role === "OWNER";

  return (
    <XStack
      ai="center"
      px="$4"
      py="$3"
      backgroundColor="white"
      borderBottomWidth={isLast ? 0 : 1}
      borderBottomColor="$gray3"
      bc="$white"
    >
      <YStack f={1} ml="$3" gap="$1">
        <Text
          fontSize="$5"
          fontWeight="700"
          color="$mainText"
          fontFamily="$baemin"
        >
          {member.nickname}
        </Text>
      </YStack>

      <View
        px="$3"
        py="$1"
        br="$4"
        bc={isOwner ? "$primary" : "$gray3"}
        opacity={isOwner ? 0.8 : 1}
      >
        <Text fontSize="$3" fontWeight="700" color="$mainText">
          {member.role}
        </Text>
      </View>
    </XStack>
  );
}
