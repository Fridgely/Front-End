import { Minus, Plus } from "@tamagui/lucide-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Button, Text, XStack, styled } from "tamagui";
import { FoodFormProps } from "../../types";
import { UnitSelector } from "./UnitSelector";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

export const QuantityInput = ({ control }: FoodFormProps) => {
  return (
    <XStack ai="center" jc="space-between">
      <LabelText>수량 및 단위</LabelText>

      <XStack gap="$3" ai="center">
        <XStack backgroundColor="$gray3" br="$4" p="$2" ai="center" gap="$3">
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, value } }) => (
              <>
                <Button
                  w={25}
                  h={30}
                  br="$2"
                  bg="white"
                  icon={<Minus size={16} />}
                  onPress={() => onChange(Math.max(0, value - 1))}
                />
                <Text fontSize="$5" fontWeight="600" minWidth={20} ta="center">
                  {value}
                </Text>
                <Button
                  w={25}
                  h={30}
                  br="$2"
                  bg="white"
                  icon={<Plus size={16} />}
                  onPress={() => onChange(value + 1)}
                />
              </>
            )}
          />
        </XStack>

        <Controller
          control={control}
          name="unit"
          render={({ field: { value, onChange } }) => (
            <UnitSelector value={value} onChange={onChange} />
          )}
        />
      </XStack>
    </XStack>
  );
};
