import { FoodItem } from "@/shared/types/food";

interface CalendarMonthViewProps {
  selectedDate: string;
  markedDates: Record<string, any>;
  onSelectDate: (date: string) => void;
}

interface CalendarFoodListProps {
  selectedDate: string;
  foods: FoodItem[];
}

export { CalendarFoodListProps, CalendarMonthViewProps };
