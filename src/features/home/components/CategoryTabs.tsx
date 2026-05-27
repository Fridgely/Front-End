import { STORAGE_TABS } from "@/shared/constants/food";
import { fs, rv, s } from "@/shared/constants/layout";
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
              pb={rv({ sm: "$2", md: "$3", lg: "$3" })}
              px="$2"
              onPress={() => onTabChange(tab)}
              style={{ position: "relative" }}
            >
              <Text
                fontFamily="$baemin"
                fontSize={rv({ sm: fs(14), md: fs(16), lg: fs(16) })}
                fontWeight="700"
                color={isActive ? "$primary" : "$gray"}
              >
                {tab}
              </Text>

              {isActive && (
                <View
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={s(3)}
                  backgroundColor="$primary"
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
