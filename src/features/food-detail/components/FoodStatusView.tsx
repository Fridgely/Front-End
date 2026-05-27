import { Text, YStack } from "tamagui";
import { FoodStatusViewProps } from "../types";

export function FoodStatusView({ title, description }: FoodStatusViewProps) {
  return (
    <YStack f={1} ai="center" jc="center" px="$6" gap="$3">
      <Text color="$mainText" fontFamily="$baemin" fontSize="$5" ta="center">
        {title}
      </Text>
      {description ? (
        <Text color="$gray10" fontFamily="$baemin" fontSize="$4" ta="center">
          {description}
        </Text>
      ) : null}
    </YStack>
  );
}
