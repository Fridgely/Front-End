import { Calendar } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Button, Text, XStack, styled } from "tamagui";
import type { FoodFormProps } from "../../../types";
import { DateSelectSheet } from "./DateSelectSheet";
import { fs, ms, s } from "@/shared/constants/layout";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

export const ExpiryDatePicker = ({ control }: FoodFormProps) => {
  const [show, setShow] = useState(false);

  const formatDate = (dateInput: any) => {
    const date = new Date(dateInput);
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    const year = validDate.getFullYear();
    const month = String(validDate.getMonth() + 1).padStart(2, "0");
    const day = String(validDate.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  return (
    <Controller
      control={control}
      name="expirationDate"
      defaultValue={new Date()}
      render={({ field: { value, onChange } }) => (
        <>
          <XStack ai="center" justifyContent="space-between">
            <LabelText>유통기한</LabelText>
            <Button
              backgroundColor="$gray3"
              br="$4"
              px="$4"
              h={ms(44)}
              pressStyle={{ scale: 0.97, bg: "$gray4" }}
              iconAfter={<Calendar size={s(16)} color="$primary" />}
              onPress={() => setShow(true)}
              borderWidth={1}
            >
              <Text fontSize={fs(14)} fontWeight="600" color="$mainText">
                {formatDate(value || new Date())}
              </Text>
            </Button>
          </XStack>

          <DateSelectSheet
            show={show}
            onClose={() => setShow(false)}
            value={
              value && !isNaN(new Date(value).getTime()) ? new Date(value) : new Date()
            }
            onChange={(date) => {
              onChange(date.toISOString());
            }}
          />
        </>
      )}
    />
  );
};

