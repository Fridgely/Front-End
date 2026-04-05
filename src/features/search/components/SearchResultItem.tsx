import { FoodItem } from "@/shared/types/food";
import { Image, Text, View, XStack, YStack } from "tamagui";
import { getDefaultFoodCategoryImage } from "../../../shared/utils/getDefaultFoodCategoryImage";
interface Props {
  item: FoodItem;
  onPress?: () => void;
}

export function SearchResultItem({ item, onPress }: Props) {
  const hasCustomImage = !!item.imageURL;
  const statusColors = {
    GREEN: "$success",
    YELLOW: "$alert",
    RED: "$warning",
    BLACK: "$expired",
  };

  const isExpired =
    item.condition.foodStatus === "BLACK" || item.condition.daysLeft < 0;

  return (
    <XStack
      ai="center"
      py="$3"
      px="$4"
      gap="$3"
      backgroundColor="$background"
      onPress={onPress}
      pressStyle={{ opacity: 0.8 }}
    >
      <View
        w={50}
        h={50}
        br="$4"
        backgroundColor="$iconThumbnailBackground"
        bw={1}
        boc="$iconThumbnailBorder"
        ov="hidden"
      >
        <View
          w="100%"
          h="100%"
          m={1}
          br="$3"
          bg="$iconThumbnailInnerBackground"
          ov="hidden"
        >
          <Image
            source={
              hasCustomImage
                ? { uri: item.imageURL }
                : getDefaultFoodCategoryImage(item.categoryName)
            }
            w="100%"
            h="100%"
            objectFit={hasCustomImage ? "cover" : "contain"}
          />
        </View>
      </View>

      <YStack f={1} gap="$1">
        <Text
          fontSize="$4"
          fontWeight="700"
          fontFamily="$heading"
          color="$mainText"
        >
          {item.name}
        </Text>
        <Text fontSize={13} color="$gray10">
          {item.condition.storageType === "REFRIGERATION"
            ? "냉장고"
            : item.condition.storageType === "FROZEN"
              ? "냉동실"
              : "실온"}
        </Text>
      </YStack>

      <YStack ai="flex-end" gap="$1">
        <View
          px="$2"
          py="$1"
          br="$3"
          bc={statusColors[item.condition.foodStatus]}
        >
          <Text fontSize={10} color="$white" fontWeight="bold">
            {isExpired ? "만료" : `D-${item.condition.daysLeft}`}
          </Text>
        </View>
        <Text fontSize={10} color="$gray10">
          {item.condition.expirationDate.split("T")[0]}
        </Text>
      </YStack>
    </XStack>
  );
}
