import { Header } from "@/shared/components/Header/Header";
import {
  useFridgeActions,
  useIsAllFridgeTab,
  useSelectedFridgeId,
} from "@/shared/stores/useFridgeStore";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { CategoryTabs } from "../components/CategoryTabs";
import { Expiry } from "../components/Expiry/Expiry";
import { FoodListItem } from "../components/FoodListItem";
import { FridgeTabScroll } from "../components/FridgeTabScroll";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { SortFilter } from "../components/SortFilter";
import { useAllFoodStatusQuery } from "../hooks/queries/useAllFoodStatusQuery";
import { useFridgeFoodStatusQuery } from "../hooks/queries/useFridgeFoodStatusQuery";
import { useFridgeQuery } from "../hooks/queries/useFridgeQuery";
import { FoodStatus, SortOption } from "../types";

export function HomeScreen() {
  const router = useRouter();
  const { data: fridgeData, isLoading: isFridgeLoading } = useFridgeQuery();
  const selectedFridgeId = useSelectedFridgeId();
  const isAllFridgeTab = useIsAllFridgeTab();
  const { setSelectedFridgeId, setIsAllFridgeTab } = useFridgeActions();

  // 냉장고 목록 로드 완료 시 첫 번째 ID 설정
  useEffect(() => {
    if (fridgeData?.data && selectedFridgeId === null) {
      const firstFridgeId = fridgeData.data[0]?.id;
      if (firstFridgeId) {
        setSelectedFridgeId(firstFridgeId);
      }
    }
  }, [fridgeData, selectedFridgeId, setSelectedFridgeId]);

  const { data: allFoodStatusData, isLoading: isAllFoodLoading } =
    useAllFoodStatusQuery(isAllFridgeTab);

  const {
    data: fridgeFoodStatusData,
    isLoading: isRefrigeratorFoodLoading,
    fetchNextPage: fetchNextFridgePage,
    hasMore: hasMoreFridgeFood,
  } = useFridgeFoodStatusQuery(selectedFridgeId, !isAllFridgeTab);

  const foodStatusData = isAllFridgeTab
    ? allFoodStatusData
    : fridgeFoodStatusData;

  const isFoodLoading = isAllFridgeTab
    ? isAllFoodLoading
    : isRefrigeratorFoodLoading;

  const [currentTab, setCurrentTab] = useState("전체");
  const [statusFilter, setStatusFilter] = useState<FoodStatus | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("EXPIRY_ASC");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allFoods = useMemo(() => {
    if (!foodStatusData?.data) return [];
    return [
      ...foodStatusData.data.black,
      ...foodStatusData.data.red,
      ...foodStatusData.data.yellow,
      ...foodStatusData.data.green,
    ];
  }, [foodStatusData]);

  const categoryOptions = useMemo(() => {
    const names = Array.from(
      new Set(allFoods.map((food) => food.categoryName).filter(Boolean)),
    );
    return ["전체", ...names];
  }, [allFoods]);

  useEffect(() => {
    if (!categoryOptions.includes(selectedCategory)) {
      setSelectedCategory("전체");
    }
  }, [categoryOptions, selectedCategory]);

  // 필터링 및 정렬 로직 (성능을 위해 useMemo 사용)
  const sortedAndFilteredFoods = useMemo(() => {
    let result = allFoods.filter((food) => {
      if (!food || !food.condition) return false;
      // 카테고리 필터
      const matchesTab =
        currentTab === "전체" ||
        (currentTab === "냉장" &&
          food.condition.storageType === "REFRIGERATION") ||
        (currentTab === "냉동" && food.condition.storageType === "FROZEN") ||
        (currentTab === "실온" &&
          food.condition.storageType === "ROOM_TEMPERATURE");

      // 식재료 상태 필터
      const matchesStatus =
        statusFilter === null || food.condition.foodStatus === statusFilter;

      const matchesCategory =
        selectedCategory === "전체" || food.categoryName === selectedCategory;

      return matchesTab && matchesStatus && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortOption === "REGISTERED_DESC") {
        return b.id - a.id;
      }

      if (sortOption === "NAME_ASC") {
        return a.name.localeCompare(b.name, "ko");
      }

      return a.condition.daysLeft - b.condition.daysLeft;
    });
  }, [allFoods, currentTab, statusFilter, selectedCategory, sortOption]);

  const currentFridgeName = isAllFridgeTab
    ? "전체"
    : fridgeData?.data?.find((f) => f.id === selectedFridgeId)?.name ||
      "냉장고";

  if (isFridgeLoading || isFoodLoading) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header />
        <HomeSkeleton />
      </YStack>
    );
  }

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title={currentFridgeName} showNotificationBell />
      <YStack gap="$5">
        <FridgeTabScroll
          selectedId={selectedFridgeId}
          isAllSelected={isAllFridgeTab}
          onSelectAll={() => setIsAllFridgeTab(true)}
          onSelect={(fridge) => {
            setSelectedFridgeId(fridge.id);
            setIsAllFridgeTab(false);
          }}
          data={fridgeData?.data}
        />
        <Expiry
          activeStatus={statusFilter}
          counts={{
            BLACK: foodStatusData?.data?.blackCount ?? 0,
            RED: foodStatusData?.data?.redCount ?? 0,
            YELLOW: foodStatusData?.data?.yellowCount ?? 0,
            GREEN: foodStatusData?.data?.greenCount ?? 0,
          }}
          onStatusChange={(status) =>
            setStatusFilter((prev) => (prev === status ? null : status))
          }
        />

        <YStack>
          <CategoryTabs activeTab={currentTab} onTabChange={setCurrentTab} />

          <XStack jc="flex-end" px="$4" py="$2">
            <Text
              fontSize={12}
              color="$gray"
              onPress={() => setIsFilterOpen(true)}
              pressStyle={{ opacity: 0.5 }}
            >
              정렬 및 필터
            </Text>
          </XStack>
        </YStack>
      </YStack>

      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={sortedAndFilteredFoods}
          renderItem={({ item }) => (
            <FoodListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/food/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          //@ts-ignore
          contentContainerStyle={{ paddingBottom: 40 }}
          onEndReached={() => {
            if (!isAllFridgeTab && hasMoreFridgeFood) {
              fetchNextFridgePage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <YStack ai="center" jc="center" py="$10">
              <Text color="$gray">해당 카테고리에 음식이 없습니다.</Text>
            </YStack>
          }
        />
      </View>

      <SortFilter
        visible={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedSort={sortOption}
        selectedCategory={selectedCategory}
        categories={categoryOptions}
        onApply={({ sort, category }) => {
          setSortOption(sort);
          setSelectedCategory(category);
        }}
      />
    </YStack>
  );
}
