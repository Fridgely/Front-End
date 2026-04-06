import { Minus, Plus } from "@tamagui/lucide-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Keyboard } from "react-native";
import { Button, Input, Text, XStack, styled } from "tamagui";
import { QuantityInputProps } from "../../types";
import { UnitSelector } from "./UnitSelector";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

export const QuantityInput = ({
  control,
  onInputFocus,
}: QuantityInputProps) => {
  return (
    <XStack ai="center" jc="space-between">
      <LabelText>수량 및 단위</LabelText>

      <XStack gap="$3" ai="center">
        <XStack backgroundColor="$gray3" br="$4" p="$2" ai="center" gap="$3">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: "수량을 입력해주세요.",
              validate: (value) => value > 0 || "수량은 1 이상이어야 합니다.",
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <Button
                  w={25}
                  h={30}
                  br="$2"
                  bg="$surface"
                  icon={<Minus size={16} />}
                  onPress={() => onChange(Math.max(1, (value ?? 1) - 1))}
                />
                <Input
                  w={56}
                  h={36}
                  p={0}
                  ta="center"
                  fontFamily="$baemin"
                  fontSize="$4"
                  fontWeight="700"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  selectTextOnFocus
                  borderWidth={0}
                  backgroundColor="transparent"
                  value={String(value ?? 1)}
                  onChangeText={(text) => {
                    const onlyNumbers = text.replace(/[^0-9]/g, "");

                    if (onlyNumbers.length === 0) {
                      return;
                    }

                    const nextValue = Number(onlyNumbers);
                    if (!Number.isFinite(nextValue)) {
                      return;
                    }

                    onChange(Math.max(1, nextValue));
                  }}
                  onBlur={() => onChange(Math.max(1, Number(value ?? 1)))}
                  onFocus={onInputFocus}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Button
                  w={25}
                  h={30}
                  br="$2"
                  bg="$surface"
                  icon={<Plus size={16} />}
                  onPress={() => onChange((value ?? 1) + 1)}
                />
              </>
            )}
          />
        </XStack>

        <Controller
          control={control}
          name="unit"
          rules={{ required: "단위를 선택해주세요." }}
          render={({ field: { value, onChange } }) => (
            <UnitSelector value={value} onChange={onChange} />
          )}
        />
      </XStack>
    </XStack>
  );
};
