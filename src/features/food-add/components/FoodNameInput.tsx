import React from "react";
import { Control, Controller } from "react-hook-form";
import { Input, Text, YStack, styled } from "tamagui";
import { FoodFormValues } from "../types";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
  mb: "$2",
});

export const FoodNameInput = ({
  control,
}: {
  control: Control<FoodFormValues>;
}) => (
  <Controller
    control={control}
    name="name"
    render={({ field: { onChange, value } }) => (
      <YStack>
        <LabelText>식품명</LabelText>
        <Input
          h={50}
          value={value}
          onChangeText={onChange}
          placeholder="식품 이름을 입력하세요"
          backgroundColor="$gray3"
          fontSize="$3"
          fontFamily="$baemin"
          fontWeight="400"
          br="$4"
          bw={0}
        />
      </YStack>
    )}
  />
);
