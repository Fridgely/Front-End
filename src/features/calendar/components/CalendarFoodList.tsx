import React from "react";
import { Image } from "react-native";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { getDefaultFoodCategoryImage } from "../../../shared/utils/getDefaultFoodCategoryImage";
import { CalendarFoodListProps } from "../types";
import {
  getBadge,
  getSelectedDateLabel,
  getStorageLabel,
} from "../utils/calendar";
import { fs, ms, rv, s } from "@/shared/constants/layout";

export function CalendarFoodList({
  selectedDate,
  foods,
  onPress,
}: CalendarFoodListProps) {
  const selectedDateLabel = getSelectedDateLabel(selectedDate);

  return (
    <YStack f={1} mt="$2" backgroundColor="$gray1">
      <View
        p={rv({ sm: "$3", md: "$4", lg: "$4" })}
        backgroundColor="$background"
        borderTopWidth={s(10)}
        borderTopColor="$gray3"
      >
        <Text
          fontSize={rv({ sm: fs(14), md: fs(16), lg: fs(16) })}
          fontWeight="700"
          fontFamily="$baemin"
        >
          {selectedDateLabel}
        </Text>
      </View>

      <ScrollView f={1}>
        {foods.length > 0 ? (
          foods.map((food) => {
            const badge = getBadge(food.condition.daysLeft);
            const hasCustomImage = !!food.imageURL;

            return (
              <XStack
                key={food.id}
                ai="center"
                jc="space-between"
                px={rv({ sm: "$3", md: "$4", lg: "$4" })}
                py={rv({ sm: "$3", md: "$4", lg: "$4" })}
                bc="$gray4"
                backgroundColor="$background"
                onPress={() => onPress?.(food)}
                pressStyle={{ opacity: 0.85 }}
              >
                <XStack ai="center" gap="$3" f={1}>
                  <View
                    w={rv({ sm: ms(44), md: ms(50), lg: ms(50) })}
                    h={rv({ sm: ms(44), md: ms(50), lg: ms(50) })}
                    br="$4"
                    backgroundColor="$iconThumbnailBackground"
                    bw={1}
                    boc="$iconThumbnailBorder"
                    ai="center"
                    jc="center"
                    ov="hidden"
                  >
                    <View
                      w={rv({ sm: ms(42), md: ms(48), lg: ms(48) })}
                      h={rv({ sm: ms(42), md: ms(48), lg: ms(48) })}
                      br="$4"
                      bg="$iconThumbnailInnerBackground"
                      ov="hidden"
                    >
                      <Image
                        source={
                          hasCustomImage
                            ? { uri: food.imageURL }
                            : getDefaultFoodCategoryImage(food.categoryName)
                        }
                        style={{
                          width: rv({ sm: ms(42), md: ms(48), lg: ms(48) }),
                          height: rv({ sm: ms(42), md: ms(48), lg: ms(48) }),
                        }}
                        resizeMode={hasCustomImage ? "cover" : "contain"}
                      />
                    </View>
                  </View>

                  <YStack f={1}>
                    <Text
                      fontSize={rv({ sm: fs(13), md: fs(15), lg: fs(15) })}
                      fontWeight="700"
                      color="$mainText"
                      fontFamily="$baemin"
                    >
                      {food.name}
                    </Text>
                    <Text
                      fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
                      color="$gray10"
                      fontFamily="$baemin"
                    >
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
                  <Text
                    color="white"
                    fontWeight="700"
                    fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
                  >
                    {badge.label}
                  </Text>
                </View>
              </XStack>
            );
          })
        ) : (
          <YStack ai="center" jc="center" py="$10">
            <Text
              color="$gray9"
              fontSize={rv({ sm: fs(13), md: fs(14), lg: fs(14) })}
              fontFamily="$baemin"
              pt="$5"
            >
              해당 날짜에 만료되는 식품이 없습니다.
            </Text>
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
