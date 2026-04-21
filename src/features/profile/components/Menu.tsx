import { fs, rv, s } from "@/shared/constants/layout";
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
        size: rv({ sm: s(17), md: s(18), lg: s(18) }),
      })
    : icon;

  return (
    <>
      <XStack
        padding={rv({ sm: "$1", md: "$4", lg: "$4" })}
        alignItems="center"
        justifyContent="space-between"
        pressStyle={{ backgroundColor: "$gray2" }}
        onPress={onPress}
      >
        <XStack alignItems="center" gap={rv({ sm: "$3", md: "$3", lg: "$3" })}>
          <View
            p={rv({ sm: "$2", md: "$2", lg: "$2" })}
            borderRadius="$3"
            backgroundColor={backgroundColor}
          >
            {clonedIcon}
          </View>
          <Text
            fontFamily="$baemin"
            fontSize={rv({ sm: fs(14), md: fs(15), lg: fs(15) })}
            fontWeight="400"
            color={titleColor}
          >
            {title}
          </Text>
        </XStack>
        <ChevronRight
          size={rv({ sm: s(17), md: s(18), lg: s(18) })}
          color={titleColor}
        />
      </XStack>
      {!isLast && <Separator marginLeft="$12" />}
    </>
  );
}
