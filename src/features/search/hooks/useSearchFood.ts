import { useFoodStatusQuery } from "@/features/home/hooks/queries/useFoodStatusQuery";
import { useSelectedFridgeId } from "@/shared/stores/useFridgeStore";
import { FoodItem } from "@/shared/types/food";
import { useMemo } from "react";

export const useSearchFood = (query: string) => {
  const selectedFridgeId = useSelectedFridgeId();
  const { data: foodStatusData } = useFoodStatusQuery(selectedFridgeId || 0);

  const filteredResult = useMemo(() => {
    if (!foodStatusData?.data) return [];

    const allFoods = Object.values(foodStatusData.data)
      .filter((value): value is FoodItem[] => Array.isArray(value))
      .flat();

    // 검색어가 없으면 전체 리스트 반환
    if (!query.trim()) return allFoods;

    // 검색어가 있으면 필터링된 리스트 반환
    return allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(query.toLowerCase()) ||
        food.categoryName.toLowerCase().includes(query.toLowerCase()),
    );
  }, [foodStatusData, query]);

  return { filteredResult };
};
