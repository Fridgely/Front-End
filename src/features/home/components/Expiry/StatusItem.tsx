import { Heading, Text, XStack, YStack } from "tamagui";
import { StatusItemProps } from "../../types";

export function StatusItem({
  icon,
  label,
  count,
  sub,
  color,
  onPress,
  opacity,
}: StatusItemProps) {
  return (
    <YStack
      ai="center"
      gap="$1"
      onPress={onPress}
      opacity={opacity}
      pressStyle={{ opacity: 0.5 }}
    >
      <XStack ai="center" gap="$1">
        {icon}
        <Heading color={color} fontWeight="700" fontSize="$4">
          {label}
        </Heading>
      </XStack>
      <Text fontSize="$5" fontWeight="700" py="$1">
        {count}
      </Text>
      <Text fontFamily="$baemin" fontSize={10} fontWeight="400" color="$gray10">
        {sub}
      </Text>
    </YStack>
  );
}
