import { fs, getDeviceSize, rv } from "@/shared/constants/layout";
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
  const isSm = getDeviceSize() === "sm";
  return (
    <YStack
      ai="center"
      gap={rv({ sm: fs(1), md: fs(2), lg: fs(2) })}
      onPress={onPress}
      opacity={opacity}
      pressStyle={{ opacity: 0.5 }}
      flexShrink={1}
      minWidth={0}
    >
      {isSm ? (
        <YStack ai="center" gap={fs(1)} minWidth={0}>
          {icon}
          <Heading
            color={color}
            fontWeight="700"
            fontSize={fs(10)}
            fontFamily="$baemin"
            numberOfLines={1}
            textAlign="center"
          >
            {label}
          </Heading>
        </YStack>
      ) : (
        <XStack ai="center" gap="$1">
          {icon}
          <Heading
            color={color}
            fontWeight="700"
            fontSize={rv({ sm: fs(10), md: fs(14), lg: fs(14) })}
            fontFamily="$baemin"
            numberOfLines={1}
          >
            {label}
          </Heading>
        </XStack>
      )}
      <Text
        fontSize={rv({ sm: fs(12), md: fs(16), lg: fs(16) })}
        fontWeight="800"
        py="$1"
        fontFamily="$baemin"
      >
        {count}
      </Text>
      <Text
        fontFamily="$baemin"
        fontSize={rv({ sm: fs(9), md: fs(10), lg: fs(10) })}
        fontWeight="400"
        color="$gray9"
        numberOfLines={1}
      >
        {sub}
      </Text>
    </YStack>
  );
}
