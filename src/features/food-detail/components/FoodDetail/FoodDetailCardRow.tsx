import { Text, XStack } from "tamagui";
import { FoodDetailCardRowProps } from "../../types";
import { fs } from "@/shared/constants/layout";

export function FoodDetailCardRow({ label, value }: FoodDetailCardRowProps) {
  return (
    <XStack jc="space-between" ai="center" py="$3">
      <Text color="$primary" fontSize={fs(13)} fontFamily="$baemin">
        {label}
      </Text>
      <Text
        color="$mainText"
        fontSize={fs(13)}
        fontWeight="700"
        fontFamily="$baemin"
      >
        {value}
      </Text>
    </XStack>
  );
}
