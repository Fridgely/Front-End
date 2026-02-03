import { STORAGE_TABS } from "@/shared/constants/food";
import { Text, View, XStack, YStack } from "tamagui";
import { CategoryTabsProps } from "../types";

export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <YStack>
      <XStack jc="space-around">
        {STORAGE_TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <View
              key={tab}
              pb="$3"
              px="$2"
              onPress={() => onTabChange(tab)}
              style={{ position: "relative" }}
            >
              <Text
                fontSize="$5"
                fontWeight={isActive ? "700" : "400"}
                color={isActive ? "$secondary" : "$gray"}
              >
                {tab}
              </Text>

              {isActive && (
                <View
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={3}
                  backgroundColor="$secondary"
                />
              )}
            </View>
          );
        })}
      </XStack>

      <View height={1} backgroundColor="$gray3" mx="$6" />
    </YStack>
  );
}
