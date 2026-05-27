import { Minus, Plus } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Keyboard } from "react-native";
import { Button, Input, Text, XStack, styled } from "tamagui";
import { QuantityInputProps } from "../../types";
import {
  adjustQuantity,
  formatQuantityDisplay,
  getQuantityValidationMessage,
  isQuantityValid,
  normalizeQuantity,
  parseQuantityInput,
  sanitizeQuantityInput,
} from "../../utils/quantityInput";
import { UnitSelector } from "./UnitSelector";
import { fs, ms, s } from "@/shared/constants/layout";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

export const QuantityInput = ({
  control,
  onInputFocus,
}: QuantityInputProps) => {
  const [editingAmountText, setEditingAmountText] = useState<string | null>(
    null,
  );
  const unit = useWatch({ control, name: "unit" }) ?? "PIECE";
  const amount = useWatch({ control, name: "amount" });
  const amountOnChangeRef = React.useRef<(value: number) => void>(() => {});

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
                isQuantityValid(value, unit) || getQuantityValidationMessage(unit),
            }}
            render={({ field: { onChange, value } }) => {
              amountOnChangeRef.current = onChange;
              const normalizedValue = normalizeQuantity(value, unit);
              const displayValue =
                editingAmountText ??
                formatQuantityDisplay(normalizedValue, unit);

              const commitAmount = (text: string) => {
                const parsed = parseQuantityInput(text);
                const next = normalizeQuantity(parsed, unit);
                onChange(next);
                setEditingAmountText(null);
              };

              return (
                <>
                  <Button
                    w={ms(20)}
                    h={ms(26)}
                    br="$2"
                    bg="$surface"
                    icon={<Minus size={s(14)} />}
                    onPress={() => {
                      setEditingAmountText(null);
                      onChange(
                        adjustQuantity(normalizedValue, unit, "down"),
                      );
                    }}
                  />
                  <Input
                    w={ms(56)}
                    h={ms(28)}
                    p={0}
                    ta="center"
                    fontFamily="$baemin"
                    fontSize={fs(14)}
                    fontWeight="700"
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    selectTextOnFocus
                    borderWidth={0}
                    backgroundColor="transparent"
                    value={displayValue}
                    onChangeText={(text) => {
                      const sanitized = sanitizeQuantityInput(text, unit);
                      setEditingAmountText(sanitized);

                      const parsed = parseQuantityInput(sanitized);
                      if (parsed !== null && !sanitized.endsWith(".")) {
                        onChange(normalizeQuantity(parsed, unit));
                      }
                    }}
                    onBlur={() => commitAmount(displayValue)}
                    onFocus={() => {
                      setEditingAmountText(
                        formatQuantityDisplay(normalizedValue, unit),
                      );
                      onInputFocus?.();
                    }}
                    onSubmitEditing={() => {
                      commitAmount(displayValue);
                      Keyboard.dismiss();
                    }}
                  />
                  <Button
                    w={ms(20)}
                    h={ms(26)}
                    br="$2"
                    bg="$surface"
                    icon={<Plus size={s(14)} />}
                    onPress={() => {
                      setEditingAmountText(null);
                      onChange(adjustQuantity(normalizedValue, unit, "up"));
                    }}
                  />
                </>
              );
            }}
          />
        </XStack>

        <Controller
          control={control}
          name="unit"
          rules={{ required: "단위를 선택해주세요." }}
          render={({ field: { value, onChange } }) => (
            <UnitSelector
              value={value}
              onChange={(nextUnit: string) => {
                onChange(nextUnit);
                if (amount != null) {
                  setEditingAmountText(null);
                  amountOnChangeRef.current(
                    normalizeQuantity(amount, nextUnit),
                  );
                }
              }}
            />
          )}
        />
      </XStack>
    </XStack>
  );
};
