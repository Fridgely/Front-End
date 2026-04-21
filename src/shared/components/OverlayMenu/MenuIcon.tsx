import React from "react";
import { Dimensions } from "react-native";
import { Circle, Text, YStack } from "tamagui";
import { MenuIconProps } from "./MenuIcon.types";
import { fs, ms, s } from "@/shared/constants/layout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function MenuIcon({
  angle,
  distance,
  icon,
  label,
  onPress,
  isDisabled,
}: MenuIconProps) {
  const ICON_SIZE = ms(52);
  const HALF_SIZE = ICON_SIZE / 2;

  //   삼각함수를 잉용하여 좌표 계산
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * distance;
  const y = Math.sin(radian) * distance;

  return (
    <YStack
      position="absolute"
      bottom={ms(52) + y}
      //   화면 중앙ㅇ을 기준으로 x만큼 이동 후 아이콘 크기의 절반만큼 보정
      left={SCREEN_WIDTH / 2 + x - HALF_SIZE}
      ai="center"
      width={ICON_SIZE + ms(24)}
      //   width가 아이콘 크기보다 커서 중앙 정렬을 위해 marginLeft로 보정
      style={{ marginLeft: -ms(12) }}
    >
      <Circle
        size={ICON_SIZE}
        backgroundColor="$surface"
        elevation={8}
        shadowColor="$black"
        shadowOpacity={0.2}
        shadowRadius={10}
        onPress={isDisabled ? undefined : onPress}
      >
        {React.cloneElement(icon as any, {
          color: "$primary",
          size: s(ICON_SIZE * 0.5),
        })}
      </Circle>
      <Text
        color="$white"
        fontSize={fs(12)}
        fontWeight="400"
        textAlign="center"
        textShadowColor="rgba(0,0,0,0.5)"
        textShadowRadius={4}
        mt={ms(3)}
      >
        {label}
      </Text>
      {isDisabled && (
        <Text
          color="$warning"
          position="absolute"
          bottom={-ms(13)}
          fontSize={fs(12)}
        >
          준비중
        </Text>
      )}
    </YStack>
  );
}
