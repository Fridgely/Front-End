import { Calendar } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Button, Text, XStack, styled } from "tamagui";
import { FoodFormProps } from "../../types";
import { DateSelectSheet } from "./DateSelectSheet";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
});

export const ExpiryDatePicker = ({ control }: FoodFormProps) => {
  const [show, setShow] = useState(false);

  const formatDate = (dateInput: any) => {
    const date = new Date(dateInput);

    // 만약 유효하지 않은 날짜라면 오늘 날짜로 대체
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
      // 앱 구동 시 초기값을 오늘 날짜 ISO 스트링으로 설정
      defaultValue={new Date()}
      render={({ field: { value, onChange } }) => (
        <>
          <XStack ai="center" justifyContent="space-between">
            <LabelText>유통기한</LabelText>
            <Button
              backgroundColor="$gray3"
              br="$4"
              px="$4"
              h={52}
              pressStyle={{ scale: 0.97, bg: "$gray4" }}
              iconAfter={<Calendar size={18} color="$primary" />}
              onPress={() => setShow(true)}
              borderWidth={1}
            >
              <Text fontSize="$4" fontWeight="600" color="$mainText">
                {formatDate(value || new Date())}
              </Text>
            </Button>
          </XStack>

          <DateSelectSheet
            show={show}
            onClose={() => setShow(false)}
            value={
              value && !isNaN(new Date(value).getTime())
                ? new Date(value)
                : new Date()
            }
            onChange={(date) => {
              // ISO 문자열로 저장
              onChange(date.toISOString());
            }}
          />
        </>
      )}
    />
  );
};
