import { FoodItem, FoodStatus } from "@/shared/types/food";

export const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const daysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

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
  };

  return marks;
};

export const getFoodsOnDate = (foods: FoodItem[], selectedDate: string) => {
  return foods.filter(
    (food) => getDateOnly(food.condition.expirationDate) === selectedDate,
  );
};

export const getSelectedDateLabel = (selectedDate: string) => {
  const [year, month, day] = selectedDate.split("-").map(Number);
  const dayOfWeek = new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
  }).format(new Date(year, month - 1, day));

  return `${String(month).padStart(2, "0")}월 ${String(day).padStart(2, "0")}일 ${dayOfWeek}`;
};
