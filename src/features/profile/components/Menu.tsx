import { ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
import { Separator, Text, View, XStack } from "tamagui";
import { MenuProps } from "../types/menu.types";

export function Menu({
  icon,
  title,
  isLast,
  titleColor = "$mainText",
  iconColor = "$primary",
  backgroundColor = "$iconBackground",
  onPress,
}: MenuProps) {
  const clonedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        color: iconColor,
        size: 20,
      })
    : icon;

  return (
    <>
      <XStack
        padding="$4"
        alignItems="center"
        justifyContent="space-between"
        pressStyle={{ backgroundColor: "$gray2" }}
        onPress={onPress}
      >
        <XStack alignItems="center" gap="$3">
          <View p="$2" borderRadius="$3" backgroundColor={backgroundColor}>
            {clonedIcon}
          </View>
          <Text fontSize="$4" fontWeight="600" color={titleColor}>
            {title}
          </Text>
        </XStack>
        <ChevronRight size={20} color={titleColor} />
      </XStack>
      {!isLast && <Separator marginLeft="$12" />}
    </>
  );
}
