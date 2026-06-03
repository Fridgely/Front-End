import { fs, ms } from "@/shared/constants/layout";
import type { StorageType } from "@/shared/types/food";
import React from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Button, Text, XStack, YStack, styled } from "tamagui";
import type { FoodFormValues } from "../../types";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
  mb: "$2",
});

const STORAGE_OPTIONS: { label: string; value: StorageType }[] = [
  { label: "냉장", value: "REFRIGERATION" },
  { label: "냉동", value: "FROZEN" },
  { label: "실온", value: "ROOM_TEMPERATURE" },
];

export const StorageSelector = ({ control }: { control: Control<FoodFormValues> }) => (
  <Controller
    control={control}
    name="storageType"
    render={({ field: { onChange, value } }) => (
      <YStack>
        <LabelText>보관 장소</LabelText>
        <XStack backgroundColor="$gray3" p="$1.5" br="$4">
          {STORAGE_OPTIONS.map(({ label, value: storageValue }) => (
            <Button
              key={storageValue}
              f={1}
              backgroundColor={value === storageValue ? "$primary" : "$gray3"}
              fontFamily="$baemin"
              color="$mainText"
              onPress={() => onChange(storageValue)}
              chromeless={value !== storageValue}
              br="$3"
              size="$4"
              h={ms(44)}
            >
              <Text fontFamily="$baemin" fontSize={fs(14)} fontWeight="700">
                {label}
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>
    )}
  />
);

