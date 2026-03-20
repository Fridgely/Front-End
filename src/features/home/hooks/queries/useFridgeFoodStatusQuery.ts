import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { FoodItem } from "@/shared/types/food";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getRefrigeratorFoodsApi } from "../../apis/food";
import type {
  FoodStatusData,
  FoodStatusResponse,
  FridgeFoodsCursorRequest,
  FridgeFoodsResponseRaw,
} from "../../apis/food.types";

const DEFAULT_CURSOR_REQUEST: FridgeFoodsCursorRequest = {
  size: 50,
  sortBy: "EXPIRATION",
};

interface UseRefrigeratorFoodStatusQueryReturn {
  // 상태별로 분류된 데이터
  data?: FoodStatusResponse;
  // 다음 페이지가 있는지
  hasMore: boolean;
  fetchNextPage: () => void;
  // 현재 페이지 페칭중
  isFetching: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  fetchStatus: "idle" | "fetching" | "paused";
}

const createEmptyFoodStatusData = (): FoodStatusData => ({
  black: [],
  red: [],
  yellow: [],
  green: [],
  blackCount: 0,
  redCount: 0,
  yellowCount: 0,
  greenCount: 0,
});

const extractFoods = (data: FridgeFoodsResponseRaw["data"]): FoodItem[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.foods)) {
    return data.foods;
  }

  if (Array.isArray(data.content)) {
    return data.content;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  return [];
};

// 식품 배열을 상태별로 분류
const groupFoodsByStatus = (foods: FoodItem[]): FoodStatusData => {
  const grouped = createEmptyFoodStatusData();

  foods.forEach((food) => {
    const foodStatus = food.condition?.foodStatus;

    if (foodStatus === "BLACK") {
      grouped.black.push(food);
      grouped.blackCount += 1;
      return;
    }

    if (foodStatus === "RED") {
      grouped.red.push(food);
      grouped.redCount += 1;
      return;
    }

    if (foodStatus === "YELLOW") {
      grouped.yellow.push(food);
      grouped.yellowCount += 1;
      return;
    }

    if (foodStatus === "GREEN") {
      grouped.green.push(food);
      grouped.greenCount += 1;
    }
  });

  return grouped;
};

// 무한 스크롤 쿼리 훅
const useFridgeFoodStatusQuery = (
  fridgeId: number | null,
  enabled = true,
): UseRefrigeratorFoodStatusQueryReturn => {
  const query = useInfiniteQuery<FridgeFoodsResponseRaw>({
    queryKey: QUERY_KEYS.food.statusByRefrigerator(fridgeId ?? 0),
    queryFn: async ({ pageParam }) => {
      // cursorId를 포함하여 api 호출
      const response = await getRefrigeratorFoodsApi(fridgeId ?? 0, {
        ...DEFAULT_CURSOR_REQUEST,
        cursorId: pageParam as number | undefined,
      }).execute();
      return response.data;
    },

    // 다음 페이지의 cursorId를 추출
    getNextPageParam: (lastPage) => {
      return (lastPage.nextCursorId ?? undefined) as number | undefined;
    },
    // 첫 페이지는 cursorId 없이 시작
    initialPageParam: undefined,
    enabled: enabled && fridgeId !== null,
  });

  // 모든 페이지의 식품을 누적하고 상태별로 그룹화
  const mappedData = useMemo<FoodStatusResponse | undefined>(() => {
    if (!query.data?.pages || query.data.pages.length === 0) {
      return undefined;
    }

    const allFoods: FoodItem[] = [];
    query.data.pages.forEach((page: any) => {
      const foods = extractFoods(page.data);
      allFoods.push(...foods);
    });

    // 누적된 식품을 상태별로 분류하여 반환
    return {
      result: "SUCCESS",
      data: groupFoodsByStatus(allFoods),
    };
  }, [query.data?.pages]);

  const hasMore = query.hasNextPage ?? false;

  return {
    data: mappedData,
    hasMore,
    fetchNextPage: query.fetchNextPage as () => void,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    fetchStatus: query.fetchStatus,
  };
};

export { useFridgeFoodStatusQuery };
