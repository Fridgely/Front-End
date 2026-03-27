export type CalendarThemeMode = "light" | "dark";

const baseCalendarTheme = {
  textMonthFontFamily: "BMJUA",
  textDayFontFamily: "BMJUA",
  textDayHeaderFontFamily: "BMJUA",
  textDayFontSize: 16,
  textMonthFontSize: 22,
} as const;

const lightCalendarTheme = {
  ...baseCalendarTheme,
  calendarBackground: "#F5F6F5",
  monthTextColor: "#111111",
  dayTextColor: "#111111",
  textDisabledColor: "#D0D4D3",
  selectedDayBackgroundColor: "#2EE6A8",
  selectedDayTextColor: "#111111",
  todayTextColor: "#2EE6A8",
  arrowColor: "#111111",
  dotColor: "#2EE6A8",
  selectedDotColor: "#FF8F2E",
  ...({
    "stylesheet.calendar.header": {
      monthText: {
        fontFamily: "BMJUA",
        fontSize: 22,
        color: "#111111",
        fontWeight: "700",
      },
      dayHeader: {
        marginTop: 8,
        marginBottom: 10,
        width: 32,
        textAlign: "center",
        fontFamily: "BMJUA",
        fontSize: 16,
        color: "#111111",
      },
      dayTextAtIndex0: { color: "#8FA7A0" },
      dayTextAtIndex6: { color: "#4A90E2" },
    },
  } as const),
} as const;

const darkCalendarTheme = {
  ...baseCalendarTheme,
  calendarBackground: "#0B1110",
  monthTextColor: "#E5EBE9",
  dayTextColor: "#E5EBE9",
  textDisabledColor: "#4A5A56",
  selectedDayBackgroundColor: "#26D19B",
  selectedDayTextColor: "#111816",
  todayTextColor: "#26D19B",
  arrowColor: "#E5EBE9",
  dotColor: "#26D19B",
  selectedDotColor: "#F97316",
  ...({
    "stylesheet.calendar.header": {
      monthText: {
        fontFamily: "BMJUA",
        fontSize: 22,
        color: "#E5EBE9",
        fontWeight: "700",
      },
      dayHeader: {
        marginTop: 8,
        marginBottom: 10,
        width: 32,
        textAlign: "center",
        fontFamily: "BMJUA",
        fontSize: 16,
        color: "#E5EBE9",
      },
      dayTextAtIndex0: { color: "#8FA7A0" },
      dayTextAtIndex6: { color: "#93B6E5" },
    },
  } as const),
} as const;

export const getCalendarTheme = (mode: CalendarThemeMode) => {
  return mode === "dark" ? darkCalendarTheme : lightCalendarTheme;
};
