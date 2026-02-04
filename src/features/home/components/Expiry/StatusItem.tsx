import { Text, XStack, YStack } from "tamagui";
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
        <Text color={color} fontWeight="700" fontSize={14}>
          {label}
        </Text>
      </XStack>
      <Text fontSize="$5" fontWeight="800" py="$1">
        {count}
      </Text>
      <Text fontSize={10} color="$gray10">
        {sub}
      </Text>
    </YStack>
  );
}
