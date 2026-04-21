import { Minus, Plus } from "@tamagui/lucide-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Keyboard } from "react-native";
import { Button, Input, Text, XStack, styled } from "tamagui";
import { QuantityInputProps } from "../../types";
import { UnitSelector } from "./UnitSelector";
import { fs, ms, s } from "@/shared/constants/layout";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

const MIN_QUANTITY = 1;

const normalizeQuantity = (value: number | null | undefined) => {
  const numericValue = Number(value ?? MIN_QUANTITY);

  if (!Number.isFinite(numericValue)) {
    return MIN_QUANTITY;
  }

  return Math.max(MIN_QUANTITY, numericValue);
};

export const QuantityInput = ({
  control,
  onInputFocus,
}: QuantityInputProps) => {
  return (
    <XStack ai="center" jc="space-between">
      <LabelText fontFamily="$baemin" fontSize={fs(14)}>
        수량 및 단위
      </LabelText>

      <XStack gap="$3" ai="center">
        <XStack backgroundColor="$gray3" br="$4" p="$2" ai="center" gap="$3">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: "수량을 입력해주세요.",
              validate: (value) =>
                value >= MIN_QUANTITY || "수량은 1 이상이어야 합니다.",
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <Button
                  w={ms(20)}
                  h={ms(26)}
                  br="$2"
                  bg="$surface"
                  icon={<Minus size={s(14)} />}
                  onPress={() => onChange(normalizeQuantity(value) - 1)}
                />
                <Input
                  w={ms(46)}
                  h={ms(28)}
                  p={0}
                  ta="center"
                  fontFamily="$baemin"
                  fontSize={fs(14)}
                  fontWeight="700"
                  keyboardType="number-pad"
                  returnKeyType="done"
                  selectTextOnFocus
                  borderWidth={0}
                  backgroundColor="transparent"
                  value={String(normalizeQuantity(value))}
                  onChangeText={(text) => {
                    const onlyNumbers = text.replace(/[^0-9]/g, "");

                    if (onlyNumbers.length === 0) {
                      return;
                    }

                    const nextValue = Number(onlyNumbers);
                    if (!Number.isFinite(nextValue)) {
                      return;
                    }

                    onChange(normalizeQuantity(nextValue));
                  }}
                  onBlur={() => onChange(normalizeQuantity(value))}
                  onFocus={onInputFocus}
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <Button
                  w={ms(20)}
                  h={ms(26)}
                  br="$2"
                  bg="$surface"
                  icon={<Plus size={s(14)} />}
                  onPress={() => onChange(normalizeQuantity(value) + 1)}
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
