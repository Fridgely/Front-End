import { Header } from "@/shared/components/Header/Header";
import { FoodItem } from "@/shared/types/food";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { CategoryTabs } from "../components/CategoryTabs";
import { Expiry } from "../components/Expiry/Expiry";
import { FoodListItem } from "../components/FoodListItem";
import { FridgeTabScroll } from "../components/FridgeTabScroll";
import { FoodStatus } from "../types";

const MOCK_FOODS: FoodItem[] = [
  {
    id: 1,
    name: "우유",
    categoryName: "유제품",
    imageURL: "",
    quantity: { amount: 1.5, unit: "L" },
    condition: {
      expirationDate: "2026-02-4",
      storageType: "REFRIGERATOR",
      foodStatus: "RED", // 빨간색 테스트
      daysLeft: 1,
    },
  },
  {
    id: 2,
    name: "닭가슴살",
    categoryName: "육류",
    imageURL: "",
    quantity: { amount: 500, unit: "g" },
    condition: {
      expirationDate: "2026-03-01",
      storageType: "FREEZER",
      foodStatus: "GREEN", // 초록색 테스트
      daysLeft: 22,
    },
  },
  {
    id: 3,
    name: "계란",
    categoryName: "알류",
    imageURL: "",
    quantity: { amount: 10, unit: "알" },
    condition: {
      expirationDate: "2026-02-15",
      storageType: "REFRIGERATOR",
      foodStatus: "YELLOW", // 노란색 테스트
      daysLeft: 8,
    },
  },
  {
    id: 4,
    name: "계란",
    categoryName: "알류",
    imageURL: "",
    quantity: { amount: 10, unit: "알" },
    condition: {
      expirationDate: "2026-02-15",
      storageType: "REFRIGERATOR",
      foodStatus: "YELLOW",
      daysLeft: 8,
    },
  },
  {
    id: 5,
    name: "계란",
    categoryName: "알류",
    imageURL: "",
    quantity: { amount: 10, unit: "알" },
    condition: {
      expirationDate: "2026-02-15",
      storageType: "REFRIGERATOR",
      foodStatus: "YELLOW",
      daysLeft: 8,
    },
  },
  {
    id: 6,
    name: "계란",
    categoryName: "알류",
    imageURL: "",
    quantity: { amount: 10, unit: "알" },
    condition: {
      expirationDate: "2026-02-15",
      storageType: "REFRIGERATOR",
      foodStatus: "YELLOW",
      daysLeft: 8,
    },
  },
];

export function HomeScreen() {
  const [selectedFridge, setSelectedFridge] = useState({
    id: 1,
    name: "우리집 냉장고",
    role: "OWNER",
    isOwner: true,
  });
  const [currentTab, setCurrentTab] = useState("전체");
  const [statusFilter, setStatusFilter] = useState<FoodStatus | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  // 필터링 및 정렬 로직 (성능을 위해 useMemo 사용)
  const sortedAndFilteredFoods = useMemo(() => {
    let result = MOCK_FOODS.filter((food) => {
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
      return isAscending
        ? a.condition.daysLeft - b.condition.daysLeft
        : b.condition.daysLeft - a.condition.daysLeft;
    });
  }, [currentTab, statusFilter, isAscending]);
  return (
    <YStack f={1} backgroundColor="$background">
      <Header title={selectedFridge.name} showNotificationBell />

      <YStack gap="$5">
        <FridgeTabScroll
          selectedId={selectedFridge.id}
          onSelect={setSelectedFridge}
        />
        <Expiry
          activeStatus={statusFilter}
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
          estimatedItemSize={120}
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
