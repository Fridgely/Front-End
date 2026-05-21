import { getCalendarTheme } from "@/features/calendar/constants/calendarTheme";
import { CalendarMonthYearPickerModal } from "@/features/calendar/components/CalendarMonthYearPickerModal";
import { daysInMonth, pad2 } from "@/features/calendar/utils/calendar";
import { fs, ms, rv, s } from "@/shared/constants/layout";
import { useResolvedTheme } from "@/shared/hooks/useResolvedTheme";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  Text as RNText,
  View as RNView,
  StyleSheet,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { View } from "tamagui";
import { CalendarMonthViewProps } from "../types";

export function CalendarMonthView({
  selectedDate,
  markedDates,
  onSelectDate,
}: CalendarMonthViewProps) {
  const { resolvedTheme, isDark } = useResolvedTheme();
  const calendarTheme = useMemo(
    () => getCalendarTheme(resolvedTheme),
    [resolvedTheme],
  );
  const arrowColor = calendarTheme.arrowColor;
  const selectedDayBg = calendarTheme.selectedDayBackgroundColor;
  const dayTextColor = calendarTheme.dayTextColor;
  const selectedDayTextColor = calendarTheme.selectedDayTextColor;
  const disabledDayTextColor = calendarTheme.textDisabledColor;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSeed, setPickerSeed] = useState({ y: 0, m: 1 });
  const [jumpKey, setJumpKey] = useState(0);

  const openMonthYearPicker = useCallback(
    (month: { getFullYear(): number; getMonth(): number }) => {
      setPickerSeed({ y: month.getFullYear(), m: month.getMonth() + 1 });
      setPickerOpen(true);
    },
    [],
  );

  const applyMonthYear = useCallback(
    (year: number, month: number) => {
      const maxDay = daysInMonth(year, month);
      const parts = selectedDate.split("-").map(Number);
      const prevDay = parts[2] ?? 1;
      const day = Math.min(prevDay, maxDay);
      onSelectDate(`${year}-${pad2(month)}-${pad2(day)}`);
      setJumpKey((k) => k + 1);
      setPickerOpen(false);
    },
    [onSelectDate, selectedDate],
  );

  return (
    <View
      px="$2"
      style={{ backgroundColor: calendarTheme.calendarBackground }}
    >
      <Calendar
        key={`${resolvedTheme}-${jumpKey}`}
        current={selectedDate}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={calendarTheme}
        hideExtraDays={false}
        enableSwipeMonths
        renderArrow={(direction) => (
          <RNText style={[styles.arrow, { color: arrowColor }]}>
            {direction === "left" ? (
              <ChevronLeft size={s(22)} color={arrowColor} />
            ) : (
              <ChevronRight size={s(22)} color={arrowColor} />
            )}
          </RNText>
        )}
        renderHeader={(month) => (
          <Pressable
            onPress={() => openMonthYearPicker(month)}
            accessibilityRole="button"
            accessibilityLabel="연도 및 월 선택"
            hitSlop={12}
          >
            <RNText
              style={[styles.headerTitle, { color: arrowColor }]}
              numberOfLines={1}
            >
              {`${month.getFullYear()}년 ${month.getMonth() + 1}월`}
            </RNText>
          </Pressable>
        )}
        dayComponent={({ date, state, marking, onPress }) => {
          const isSelected = !!marking?.selected;
          const isDimmed = state === "disabled";
          const isTouchDisabled = !!marking?.disabled;
          const dots = marking?.dots ?? [];

          return (
            <Pressable
              style={styles.dayWrap}
              disabled={isTouchDisabled}
              onPress={() => {
                if (isTouchDisabled || !date?.dateString) return;
                onPress?.(date);
                onSelectDate(date.dateString);
              }}
            >
              <RNView
                style={[
                  styles.dayCircle,
                  isSelected && { backgroundColor: selectedDayBg, borderRadius: 9999 },
                  isDimmed && styles.dayCircleDisabled,
                ]}
              >
                <RNText
                  style={[
                    styles.dayText,
                    { color: dayTextColor },
                    isSelected && { color: selectedDayTextColor },
                    isDimmed && { color: disabledDayTextColor },
                  ]}
                >
                  {date?.day}
                </RNText>
              </RNView>

              <RNView style={styles.dotRow}>
                {dots.slice(0, 3).map((dot: any, idx: number) => (
                  <RNView
                    key={`${dot.key ?? idx}`}
                    style={[styles.dot, { backgroundColor: dot.color }]}
                  />
                ))}
              </RNView>
            </Pressable>
          );
        }}
      />

      <CalendarMonthYearPickerModal
        open={pickerOpen}
        year={pickerSeed.y}
        month={pickerSeed.m}
        onClose={() => setPickerOpen(false)}
        onConfirm={applyMonthYear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "BMJUA",
    fontSize: rv({ sm: fs(16), md: fs(18), lg: fs(18) }),
    fontWeight: "700",
    textAlign: "center",
  },
  arrow: {
    fontSize: rv({ sm: fs(14), md: fs(18), lg: fs(18) }),
    fontWeight: "700",
    paddingHorizontal: ms(6),
  },
  dayWrap: {
    // sm에서도 dayCircle + dotRow가 겹치지 않도록 wrapper를 충분히 확보
    width: rv({ sm: ms(34), md: ms(34), lg: ms(34) }),
    height: rv({ sm: ms(44), md: ms(40), lg: ms(40) }),
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: rv({ sm: ms(28), md: ms(30), lg: ms(30) }),
    height: rv({ sm: ms(28), md: ms(30), lg: ms(30) }),
    // 기기별 스케일/반올림 차이로 원형이 깨지는 경우를 방지
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleDisabled: {
    opacity: 0.35,
  },
  dayText: {
    fontFamily: "BMJUA",
    fontSize: rv({ sm: fs(10), md: fs(14), lg: fs(14) }),
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dotRow: {
    minHeight: rv({ sm: ms(6), md: ms(8), lg: ms(8) }),
    marginTop: rv({ sm: ms(1), md: ms(2), lg: ms(2) }),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rv({ sm: ms(1), md: ms(2), lg: ms(2) }),
  },
  dot: {
    width: rv({ sm: s(3), md: s(4), lg: s(4) }),
    height: rv({ sm: s(3), md: s(4), lg: s(4) }),
    borderRadius: rv({ sm: s(2), md: s(2), lg: s(2) }),
  },
});
