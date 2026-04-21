import { fs, ms, rv } from "@/shared/constants/layout";

export type CalendarThemeMode = "light" | "dark";

const baseCalendarTheme = {
  textMonthFontFamily: "BMJUA",
  textDayFontFamily: "BMJUA",
  textDayHeaderFontFamily: "BMJUA",
  textDayFontSize: rv({ sm: fs(12), md: fs(14), lg: fs(14) }),
  textMonthFontSize: rv({ sm: fs(16), md: fs(18), lg: fs(18) }),
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
        fontSize: rv({ sm: fs(16), md: fs(18), lg: fs(18) }),
        color: "#111111",
        fontWeight: "700",
      },
      dayHeader: {
        marginTop: ms(8),
        marginBottom: ms(10),
        width: ms(30),
        textAlign: "center",
        fontFamily: "BMJUA",
        fontSize: rv({ sm: fs(11), md: fs(13), lg: fs(13) }),
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
        fontSize: rv({ sm: fs(16), md: fs(18), lg: fs(18) }),
        color: "#E5EBE9",
        fontWeight: "700",
      },
      dayHeader: {
        marginTop: ms(8),
        marginBottom: ms(10),
        width: ms(30),
        textAlign: "center",
        fontFamily: "BMJUA",
        fontSize: rv({ sm: fs(11), md: fs(13), lg: fs(13) }),
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
