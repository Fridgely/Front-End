import React from "react";
import { Dimensions } from "react-native";
import { Circle, Text, YStack } from "tamagui";
import { MenuIconProps } from "./MenuIcon.types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function MenuIcon({
  angle,
  distance,
  icon,
  label,
  onPress,
  isDisabled,
}: MenuIconProps) {
  const ICON_SIZE = 60;
  const HALF_SIZE = ICON_SIZE / 2;

  //   삼각함수를 잉용하여 좌표 계산
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian) * distance;
  const y = Math.sin(radian) * distance;

  return (
    <YStack
      position="absolute"
      bottom={60 + y}
      //   화면 중앙ㅇ을 기준으로 x만큼 이동 후 아이콘 크기의 절반만큼 보정
      left={SCREEN_WIDTH / 2 + x - HALF_SIZE}
      ai="center"
      width={ICON_SIZE + 30}
      //   width가 아이콘 크기보다 커서 중앙 정렬을 위해 marginLeft로 보정
      style={{ marginLeft: -15 }}
    >
      <Circle
        size={ICON_SIZE}
        backgroundColor="white"
        elevation={8}
        shadowColor="#000"
        shadowOpacity={0.2}
        shadowRadius={10}
        onPress={isDisabled ? undefined : onPress}
      >
        {React.cloneElement(icon as any, {
          color: "#2BEEAD",
          size: ICON_SIZE * 0.5,
        })}
      </Circle>
      <Text
        color="white"
        fontSize="$3"
        fontWeight="400"
        textAlign="center"
        textShadowColor="rgba(0,0,0,0.5)"
        textShadowRadius={4}
        mt={3}
      >
        {label}
      </Text>
      {isDisabled && (
        <Text color="$warning" position="absolute" bottom={-13} fontSize={12}>
          준비중
        </Text>
      )}
    </YStack>
  );
}
