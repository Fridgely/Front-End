import { getCalendarTheme } from "@/features/calendar/constants/calendarTheme";
import { fs, ms, rv, s } from "@/shared/constants/layout";
import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
import {
  Pressable,
  Text as RNText,
  View as RNView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { View } from "tamagui";
import { CalendarMonthViewProps } from "../types";

export function CalendarMonthView({
  selectedDate,
  markedDates,
  onSelectDate,
}: CalendarMonthViewProps) {
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const resolvedTheme = resolveTheme(theme, systemColorScheme);
  const isDark = resolvedTheme === "dark";
  const arrowColor = isDark ? "#E5EBE9" : "#111111";
  const selectedDayBg = isDark ? "#26D19B" : "#2EE6A8";
  const dayTextColor = isDark ? "#E5EBE9" : "#111111";
  const selectedDayTextColor = "#111111";
  const disabledDayTextColor = isDark ? "#4A5A56" : "#D0D4D3";

  return (
    <View px="$2">
      <Calendar
        current={selectedDate}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={getCalendarTheme(resolvedTheme)}
        hideExtraDays={false}
        enableSwipeMonths
        renderArrow={(direction) => (
          <RNText style={[styles.arrow, { color: arrowColor }]}>
            {direction === "left" ? (
              <ChevronLeft size={s(22)} color="$mainText" />
            ) : (
              <ChevronRight size={s(22)} color="$mainText" />
            )}
          </RNText>
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
    </View>
  );
}

const styles = StyleSheet.create({
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
