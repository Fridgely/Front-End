import React from "react";
import { Image } from "react-native";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { CalendarFoodListProps } from "../types";
import {
  getBadge,
  getSelectedDateLabel,
  getStorageLabel,
} from "../utils/calendar";

export function CalendarFoodList({
  selectedDate,
  foods,
  onPress,
}: CalendarFoodListProps) {
  const selectedDateLabel = getSelectedDateLabel(selectedDate);

  return (
    <YStack f={1} mt="$2" backgroundColor="$gray1">
      <View
        p="$4"
        backgroundColor="$background"
        borderTopWidth={10}
        borderTopColor="$gray3"
      >
        <Text fontSize={18} fontWeight="700" fontFamily="$baemin">
          {selectedDateLabel}
        </Text>
      </View>

      <ScrollView f={1}>
        {foods.length > 0 ? (
          foods.map((food) => {
            const badge = getBadge(food.condition.daysLeft);

            return (
              <XStack
                key={food.id}
                ai="center"
                jc="space-between"
                px="$4"
                py="$4"
                bc="$gray4"
                backgroundColor="$background"
                onPress={() => onPress?.(food)}
                pressStyle={{ opacity: 0.85 }}
              >
                <XStack ai="center" gap="$3" f={1}>
                  <View
                    w={56}
                    h={56}
                    br="$4"
                    backgroundColor="$gray3"
                    ai="center"
                    jc="center"
                    ov="hidden"
                  >
                    {food.imageURL ? (
                      <Image
                        source={{ uri: food.imageURL }}
                        style={{ width: 56, height: 56 }}
                      />
                    ) : null}
                  </View>

                  <YStack f={1}>
                    <Text
                      fontSize="$5"
                      fontWeight="700"
                      color="$mainText"
                      fontFamily="$baemin"
                    >
                      {food.name}
                    </Text>
                    <Text fontSize="$4" color="$gray10" fontFamily="$baemin">
                      {getStorageLabel(food.condition.storageType)}{" "}
                      {food.categoryName}
                    </Text>
                  </YStack>
                </XStack>

                <View
                  px="$3"
                  py="$1"
                  borderRadius="$6"
                  backgroundColor={badge.color}
                >
                  <Text color="white" fontWeight="700" fontSize="$5">
                    {badge.label}
                  </Text>
                </View>
              </XStack>
            );
          })
        ) : (
          <YStack ai="center" jc="center" py="$10">
            <Text color="$gray9" fontSize="$5" fontFamily="$baemin" pt="$5">
              해당 날짜에 만료되는 식품이 없습니다.
            </Text>
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
