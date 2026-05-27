import { fs, ms, rv } from "@/shared/constants/layout";
import { useResolvedTheme } from "@/shared/hooks/useResolvedTheme";
import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  Text as RNText,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button, Text, YStack } from "tamagui";

type CalendarMonthYearPickerModalProps = {
  open: boolean;
  year: number;
  month: number;
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
};

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MIN_SELECTABLE_YEAR = 2026;

export function CalendarMonthYearPickerModal({
  open,
  year,
  month,
  onClose,
  onConfirm,
}: CalendarMonthYearPickerModalProps) {
  const { isDark } = useResolvedTheme();
  const [draftYear, setDraftYear] = useState(year);
  const [draftMonth, setDraftMonth] = useState(month);

  const chipBg = isDark ? "#1A2422" : "#F3F4F6";
  const chipText = isDark ? "#C5D0CD" : "#374151";
  const chipActiveBg = isDark ? "#26D19B" : "#2BEEAD";
  const chipActiveText = isDark ? "#111816" : "#065F46";

  useEffect(() => {
    if (open) {
      setDraftYear(Math.max(year, MIN_SELECTABLE_YEAR));
      setDraftMonth(month);
    }
  }, [open, year, month]);

  const yearRange = useMemo(() => {
    const lastYear = Math.max(
      MIN_SELECTABLE_YEAR + 12,
      new Date().getFullYear() + 8,
    );
    const list: number[] = [];
    for (let i = MIN_SELECTABLE_YEAR; i <= lastYear; i += 1) {
      list.push(i);
    }
    return list;
  }, []);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <RNView
          onStartShouldSetResponder={() => true}
          style={{ maxWidth: 400, width: "100%", alignSelf: "center" }}
        >
          <YStack
            bg="$background"
            borderRadius="$5"
            maxWidth={400}
            width="100%"
            alignSelf="center"
            p="$4"
            gap="$3"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text
              fontFamily="$baemin"
              fontSize={rv({ sm: fs(18), md: fs(20), lg: fs(20) })}
              fontWeight="700"
              color="$mainText"
            >
              연도·월 선택
            </Text>

            <Text
              fontFamily="$baemin"
              fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
              color="$gray"
            >
              연도
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.yearRow}
            >
              {yearRange.map((y) => {
                const active = y === draftYear;
                return (
                  <Pressable
                    key={y}
                    onPress={() => setDraftYear(y)}
                    style={[
                      styles.yearChip,
                      { backgroundColor: chipBg },
                      active && { backgroundColor: chipActiveBg },
                    ]}
                  >
                    <RNText
                      style={[
                        styles.yearChipText,
                        { color: chipText },
                        active && { color: chipActiveText, fontWeight: "700" },
                      ]}
                    >
                      {y}
                    </RNText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text
              fontFamily="$baemin"
              fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
              color="$gray"
            >
              월
            </Text>
            <RNView style={styles.monthGrid}>
              {MONTHS.map((m) => {
                const active = m === draftMonth;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setDraftMonth(m)}
                    style={[
                      styles.monthCell,
                      { backgroundColor: chipBg },
                      active && { backgroundColor: chipActiveBg },
                    ]}
                  >
                    <RNText
                      style={[
                        styles.monthCellText,
                        { color: chipText },
                        active && { color: chipActiveText, fontWeight: "700" },
                      ]}
                    >
                      {m}월
                    </RNText>
                  </Pressable>
                );
              })}
            </RNView>

            <YStack gap="$2" pt="$2">
              <Button
                size="$4"
                bg="$primary"
                fontFamily="$baemin"
                onPress={() => onConfirm(draftYear, draftMonth)}
              >
                확인
              </Button>
              <Button
                size="$4"
                variant="outlined"
                borderColor="$gray8"
                fontFamily="$baemin"
                color="$gray"
                onPress={onClose}
              >
                취소
              </Button>
            </YStack>
          </YStack>
        </RNView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: ms(20),
  },
  yearRow: {
    gap: ms(8),
    paddingVertical: ms(4),
    flexDirection: "row",
  },
  yearChip: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    borderRadius: ms(12),
    minWidth: ms(72),
    alignItems: "center",
  },
  yearChipText: {
    fontFamily: "BMJUA",
    fontSize: rv({ sm: fs(15), md: fs(16), lg: fs(16) }),
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ms(8),
    justifyContent: "flex-start",
  },
  monthCell: {
    width: "22%",
    paddingVertical: ms(10),
    borderRadius: ms(12),
    alignItems: "center",
  },
  monthCellText: {
    fontFamily: "BMJUA",
    fontSize: rv({ sm: fs(14), md: fs(15), lg: fs(15) }),
  },
});
