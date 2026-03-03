import { FoodItem, FoodStatus } from "@/shared/types/food";

const STATUS_DOT_COLOR: Record<FoodStatus, string> = {
  GREEN: "#22C55E",
  YELLOW: "#F97316",
  RED: "#EF4444",
  BLACK: "#1E293B",
};

export const getStorageLabel = (
  storageType: FoodItem["condition"]["storageType"],
) => {
  if (storageType === "REFRIGERATION") return "냉장고";
  if (storageType === "FROZEN") return "냉동실";
  return "실온";
};

export const getBadge = (daysLeft: number) => {
  if (daysLeft < 0) return { label: "만료", color: "#1E293B" };
  if (daysLeft <= 10) return { label: `D-${daysLeft}`, color: "#EF4444" };
  if (daysLeft <= 20) return { label: `D-${daysLeft}`, color: "#F97316" };
  return { label: `D-${daysLeft}`, color: "#22C55E" };
};

export const getDateOnly = (isoDate: string) => isoDate.split("T")[0];

export const buildMarkedDates = (foods: FoodItem[], selectedDate: string) => {
  const marks: Record<
    string,
    {
      dots: { key: string; color: string }[];
      selected?: boolean;
      selectedColor?: string;
    }
  > = {};

  foods.forEach((food) => {
    const date = getDateOnly(food.condition.expirationDate);
    const status = food.condition.foodStatus;
    const color = STATUS_DOT_COLOR[status] ?? "#1E293B";

    if (!marks[date]) marks[date] = { dots: [] };

    if (!marks[date].dots.some((dot) => dot.color === color)) {
      marks[date].dots.push({ key: `${date}-${status}`, color });
    }
  });

  marks[selectedDate] = {
    ...(marks[selectedDate] || { dots: [] }),
    selected: true,
    selectedColor: "#2EE6A8",
  };

  return marks;
};

export const getFoodsOnDate = (foods: FoodItem[], selectedDate: string) => {
  return foods.filter(
    (food) => getDateOnly(food.condition.expirationDate) === selectedDate,
  );
};

export const getSelectedDateLabel = (selectedDate: string) => {
  const [, month, day] = selectedDate.split("-");
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
  }).format(new Date(selectedDate));

  return `${month}월 ${day}일 ${dayOfWeek}`;
};
