import { Text, XStack } from "tamagui";
import { FoodDetailCardRowProps } from "../../types";

export function FoodDetailCardRow({ label, value }: FoodDetailCardRowProps) {
  return (
    <XStack jc="space-between" ai="center" py="$3">
      <Text color="$primary" fontSize="$4" fontFamily="$baemin">
        {label}
      </Text>
      <Text
        color="$mainText"
        fontSize="$4"
        fontWeight="700"
        fontFamily="$baemin"
      >
        {value}
      </Text>
    </XStack>
  );
}
