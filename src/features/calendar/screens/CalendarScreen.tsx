import { Header } from "@/shared/components/Header/Header";
import { useSelectedFridgeId } from "@/shared/stores/useFridgeStore";
import { FoodItem } from "@/shared/types/food";
import React, { useMemo, useState } from "react";
import { YStack } from "tamagui";
import { useFoodStatusQuery } from "../../home/hooks/queries/useFoodStatusQuery";
import { CalendarFoodList } from "../components/CalendarFoodList";
import { CalendarMonthView } from "../components/CalendarMonthView";
import { setupCalendarLocale } from "../constants/calendarLocale";
import { buildMarkedDates, getFoodsOnDate } from "../utils/calendar";

setupCalendarLocale();

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export function CalendarScreen() {
  const selectedFridgeId = useSelectedFridgeId();

  const [selectedDate, setSelectedDate] = useState(() => getLocalDateString());

  const { data: foodStatusData } = useFoodStatusQuery(selectedFridgeId ?? 0);

  const allFoods = useMemo<FoodItem[]>(() => {
    if (!foodStatusData?.data) return [];
    return [
      ...foodStatusData.data.black,
      ...foodStatusData.data.red,
      ...foodStatusData.data.yellow,
      ...foodStatusData.data.green,
    ];
  }, [foodStatusData]);

  const markedDates = useMemo(
    () => buildMarkedDates(allFoods, selectedDate),
    [allFoods, selectedDate],
  );

  const foodsOnSelectedDate = useMemo(
    () => getFoodsOnDate(allFoods, selectedDate),
    [allFoods, selectedDate],
  );

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="유통기한 캘린더" showBackButton />

      <CalendarMonthView
        selectedDate={selectedDate}
        markedDates={markedDates}
        onSelectDate={setSelectedDate}
      />

      <CalendarFoodList
        selectedDate={selectedDate}
        foods={foodsOnSelectedDate}
      />
    </YStack>
  );
}
