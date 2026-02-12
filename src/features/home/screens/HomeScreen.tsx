import { Header } from "@/shared/components/Header/Header";
import {
  useFridgeActions,
  useSelectedFridgeId,
} from "@/shared/stores/useFridgeStore";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { CategoryTabs } from "../components/CategoryTabs";
import { Expiry } from "../components/Expiry/Expiry";
import { FoodListItem } from "../components/FoodListItem";
import { FridgeTabScroll } from "../components/FridgeTabScroll";
import { HomeSkeleton } from "../components/HomeSkeleton";
import { useFoodStatusQuery } from "../hooks/queries/useFoodStatusQuery";
import { useFridgeQuery } from "../hooks/queries/useFridgeQuery";
import { FoodStatus } from "../types";

export function HomeScreen() {
  const { data: fridgeData, isLoading: isFridgeLoading } = useFridgeQuery();
  // 첫번째 냉장고를 기본값으로 설정
  const selectedFridgeId = useSelectedFridgeId();
  const { setSelectedFridgeId } = useFridgeActions();

  // 냉장고 목록 로드 완료 시 첫 번째 ID 설정
  useEffect(() => {
    if (fridgeData?.data && selectedFridgeId === null) {
      const firstFridgeId = fridgeData.data[0]?.id;
      if (firstFridgeId) {
        setSelectedFridgeId(firstFridgeId);
      }
    }
  }, [fridgeData, selectedFridgeId]);

  const { data: foodStatusData, isLoading: isFoodLoading } = useFoodStatusQuery(
    selectedFridgeId || 0,
  );

  const [currentTab, setCurrentTab] = useState("전체");
  const [statusFilter, setStatusFilter] = useState<FoodStatus | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  // 필터링 및 정렬 로직 (성능을 위해 useMemo 사용)
  const sortedAndFilteredFoods = useMemo(() => {
    if (!foodStatusData?.data) return [];

    // 전체를 하나의 배열로
    const allFoods = Object.values(foodStatusData.data).flat();

    let result = allFoods.filter((food) => {
      if (!food || !food.condition) return false;
      // 카테고리 필터
      const matchesTab =
        currentTab === "전체" ||
        (currentTab === "냉장" &&
          food.condition.storageType === "REFRIGERATOR") ||
        (currentTab === "냉동" && food.condition.storageType === "FREEZER") ||
        (currentTab === "실온" &&
          food.condition.storageType === "ROOM_TEMPERATURE");

      // 식재료 상태 필터
      const matchesStatus =
        statusFilter === null || food.condition.foodStatus === statusFilter;

      return matchesTab && matchesStatus;
    });

    // 정렬 로직 (유통기한 순)
    return result.sort((a, b) => {
      const diff = a.condition.daysLeft - b.condition.daysLeft;
      return isAscending ? diff : -diff;
    });
  }, [foodStatusData, currentTab, statusFilter, isAscending]);

  const currentFridgeName =
    fridgeData?.data?.find((f) => f.id === selectedFridgeId)?.name || "냉장고";

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
          onSelect={(fridge) => setSelectedFridgeId(fridge.id)}
          data={fridgeData?.data}
        />
        <Expiry
          activeStatus={statusFilter}
          counts={{
            BLACK: foodStatusData?.data?.BLACK?.length || 0,
            RED: foodStatusData?.data?.RED?.length || 0,
            YELLOW: foodStatusData?.data?.YELLOW?.length || 0,
            GREEN: foodStatusData?.data?.GREEN?.length || 0,
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
              onPress={() => setIsAscending(!isAscending)}
              pressStyle={{ opacity: 0.5 }}
            >
              유통기한순 정렬 {isAscending ? "▲" : "▼"}
            </Text>
          </XStack>
        </YStack>
      </YStack>

      <View style={{ flex: 1, width: "100%" }}>
        <FlashList
          data={sortedAndFilteredFoods}
          renderItem={({ item }) => <FoodListItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          //@ts-ignore
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <YStack ai="center" jc="center" py="$10">
              <Text color="$gray">해당 카테고리에 음식이 없습니다.</Text>
            </YStack>
          }
        />
      </View>
    </YStack>
  );
}
