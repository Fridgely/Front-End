import { fs, ms, s } from "@/shared/constants/layout";
import { Check } from "@tamagui/lucide-icons";
import React from "react";
import { Button, Text } from "tamagui";
import { DayButtonProps } from "../types";

export const DayButton = ({ day, active, onPress }: DayButtonProps) => (
  <Button
    size="$3"
    br="$2"
    h={ms(36)}
    paddingHorizontal="$5"
    backgroundColor={active ? "$primary" : "$gray3"}
    onPress={onPress}
    pressStyle={{ scale: 0.95 }}
    icon={active ? <Check size={s(15)} color="$white" strokeWidth={2} /> : null}
    animation="quick"
  >
    <Text
      color={active ? "$white" : "$mainText"}
      fontWeight="700"
      fontSize={fs(13)}
    >
      {day}일 전
    </Text>
  </Button>
);
