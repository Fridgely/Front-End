import { getBottomPaddingForSheet } from "@/shared/constants/layout";
import { ChevronRight } from "@tamagui/lucide-icons";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Sheet, Text, View, XStack, YStack } from "tamagui";
import { AM_PM, HOURS, MINUTES, PICKER_ITEM_HEIGHT } from "../../constants";
import { TimePickerSelectProps } from "../../types";
import { PickerColumn } from "./PickerColumn";

const TimePickerSelectBase = ({
  value,
  onValueChange,
  disabled,
}: TimePickerSelectProps) => {
  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (open) setTempValue(value);
  }, [open, value]);

  const parseValue = useCallback((val: string) => {
    const [h, m] = val.split(":").map(Number);
    return { isPm: h >= 12, hour: h % 12 === 0 ? 12 : h % 12, minute: m };
  }, []);

  const { isPm, hour, minute } = useMemo(
    () => parseValue(tempValue),
    [parseValue, tempValue],
  );

  const display = useMemo(() => parseValue(value), [parseValue, value]);

  const handleTempSelect = useCallback(
    (changes: any) => {
      const current = parseValue(tempValue);
      const updated = { ...current, ...changes };
      let finalHour = updated.hour % 12;
      if (updated.isPm) finalHour += 12;
      const formattedTime = `${String(finalHour).padStart(2, "0")}:${String(updated.minute).padStart(2, "0")}:00`;
      setTempValue(formattedTime);
    },
    [parseValue, tempValue],
  );

  const handleConfirm = useCallback(() => {
    onValueChange(tempValue);
    setOpen(false);
  }, [onValueChange, tempValue]);

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
        disabled={disabled}
        onPress={() => {
          if (disabled) return;
          setOpen(true);
        }}
      >
        <Text color="$primary" fontWeight="bold">
          {display.isPm ? "오후" : "오전"}{" "}
          {String(display.hour).padStart(2, "0")}:
          {String(display.minute).padStart(2, "0")}
        </Text>
      </Button>

      {open ? (
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
      ) : null}
    </>
  );
};

export const TimePickerSelect = memo(TimePickerSelectBase);
TimePickerSelect.displayName = "TimePickerSelect";
