import { calendarTheme } from "@/features/calendar/constants/calendarTheme";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
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
  return (
    <View px="$2">
      <Calendar
        current={selectedDate}
        onDayPress={(day: DateData) => onSelectDate(day.dateString)}
        markingType="multi-dot"
        markedDates={markedDates}
        theme={calendarTheme}
        hideExtraDays={false}
        enableSwipeMonths
        renderArrow={(direction) => (
          <RNText style={styles.arrow}>
            {direction === "left" ? (
              <ChevronLeft size={24} color="$mainText" />
            ) : (
              <ChevronRight size={24} color="$mainText" />
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
                  isSelected && styles.dayCircleSelected,
                  isDimmed && styles.dayCircleDisabled,
                ]}
              >
                <RNText
                  style={[
                    styles.dayText,
                    isSelected && styles.dayTextSelected,
                    isDimmed && styles.dayTextDisabled,
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
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
    paddingHorizontal: 6,
  },
  dayWrap: {
    width: 36,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    borderRadius: 20,
    backgroundColor: "#2EE6A8",
  },
  dayCircleDisabled: {
    opacity: 0.35,
  },
  dayText: {
    fontFamily: "BMJUA",
    fontSize: 16,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    color: "#111111",
  },
  dayTextSelected: {
    fontWeight: "700",
    color: "#111111",
  },
  dayTextDisabled: {
    color: "#D0D4D3",
  },
  dotRow: {
    minHeight: 8,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
