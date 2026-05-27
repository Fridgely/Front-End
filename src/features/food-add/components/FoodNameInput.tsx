import { ms } from "@/shared/constants/layout";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Input, Text, YStack, styled, useThemeName } from "tamagui";
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
}) => {
  const themeName = useThemeName();

  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: "식품명을 입력해주세요.",
        validate: (value) =>
          value?.trim().length > 0 || "식품명을 입력해주세요.",
        maxLength: { value: 20, message: "최대 20자까지 입력할 수 있습니다." },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <YStack>
          <LabelText>식품명</LabelText>
          {error && (
            <Text color="$warning" fontSize="$3" fontWeight="600" mb="$2">
              {error.message}
            </Text>
          )}
          <Input
            h={ms(44)}
            value={value}
            onChangeText={onChange}
            placeholder="식품 이름을 입력하세요"
            placeholderTextColor={themeName === "dark" ? "$gray10" : "$gray5"}
            backgroundColor="$gray3"
            fontSize="$2"
            fontFamily="$baemin"
            fontWeight="400"
            br="$4"
            bw={0}
          />
        </YStack>
      )}
    />
  );
};
