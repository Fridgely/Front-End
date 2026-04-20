import { ChevronRight } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Sheet, Text, View, XStack, YStack } from "tamagui";
import { AM_PM, HOURS, MINUTES, PICKER_ITEM_HEIGHT } from "../../constants";
import { PickerColumn } from "./PickerColumn";
import { getBottomPaddingForSheet } from "@/shared/constants/layout";

export const TimePickerSelect = ({ value, onValueChange }: any) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (open) setTempValue(value);
  }, [open, value]);

  const parseValue = (val: string) => {
    const [h, m] = val.split(":").map(Number);
    return { isPm: h >= 12, hour: h % 12 === 0 ? 12 : h % 12, minute: m };
  };

  const { isPm, hour, minute } = parseValue(tempValue);

  const handleTempSelect = (changes: any) => {
    const current = parseValue(tempValue);
    const updated = { ...current, ...changes };
    let finalHour = updated.hour % 12;
    if (updated.isPm) finalHour += 12;
    const formattedTime = `${String(finalHour).padStart(2, "0")}:${String(updated.minute).padStart(2, "0")}:00`;
    setTempValue(formattedTime);
  };

  const handleConfirm = () => {
    onValueChange(tempValue);
    setOpen(false);
  };

  return (
    <>
      <Button
        width={130}
        height={36}
        br="$2"
        bc="$iconBackground"
        boc="$gray4"
        bw={1}
        iconAfter={<ChevronRight size={16} />}
        jc="space-between"
        px="$3"
        onPress={() => setOpen(true)}
      >
        <Text color="$primary" fontWeight="bold">
          {parseValue(value).isPm ? "오후" : "오전"}{" "}
          {String(parseValue(value).hour).padStart(2, "0")}:
          {String(parseValue(value).minute).padStart(2, "0")}
        </Text>
      </Button>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[40]}
        dismissOnSnapToBottom
        animation="quick"
      >
        <Sheet.Overlay
          animation="quick"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <Sheet.Frame
          p="$4"
          pb={getBottomPaddingForSheet({
            bottomInset: insets.bottom,
          })}
          backgroundColor="$background"
          br="$5"
        >
          <Sheet.Handle />
          <YStack f={1} gap="$4" mt="$3" jc="center" ai="center">
            <Text fontSize="$5" fontWeight="700" color="$mainText">
              알림 시간 설정
            </Text>

            <XStack
              f={1}
              gap="$1"
              jc="center"
              ai="center"
              h={PICKER_ITEM_HEIGHT * 3}
              pos="relative"
            >
              <View
                pos="absolute"
                h={PICKER_ITEM_HEIGHT}
                l={0}
                r={0}
                t="50%"
                y="-50%"
                backgroundColor="$gray2"
                br="$3"
                zi={-1}
              />

              <PickerColumn
                items={AM_PM}
                selected={isPm ? "오후" : "오전"}
                onSelect={(val) => handleTempSelect({ isPm: val === "오후" })}
                width={80}
              />
              <Text fontSize="$5" fontWeight="300" color="$gray8" mx="$1">
                :
              </Text>
              <PickerColumn
                items={HOURS}
                selected={hour}
                onSelect={(val) => handleTempSelect({ hour: val })}
                format={(v) => String(v).padStart(2, "0")}
                width={60}
              />
              <Text fontSize="$5" fontWeight="300" color="$gray8" mx="$1">
                :
              </Text>
              <PickerColumn
                items={MINUTES}
                selected={minute}
                onSelect={(val) => handleTempSelect({ minute: val })}
                format={(v) => String(v).padStart(2, "0")}
                width={60}
              />
            </XStack>

            <Button
              mt="$4"
              w="100%"
              h={48}
              br="$3"
              onPress={handleConfirm}
              backgroundColor="$primary"
            >
              <Text color="$white" fontWeight="bold" fontSize="$4">
                확인
              </Text>
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};
