import {
  FOOD_STATUS_BG_COLORS,
  FOOD_STATUS_LABELS,
} from "@/shared/constants/food";
import { getExpiryLabel } from "@/shared/utils/date";
import { getUnitLabel } from "@/shared/utils/food";
import { Card, Heading, Image, Text, View, XStack, YStack } from "tamagui";
import { getDefaultFoodCategoryImage } from "../../../../shared/utils/getDefaultFoodCategoryImage";
import { FoodListItemProps } from "../../types";

export function FoodListItem({ item, onPress }: FoodListItemProps) {
  const hasCustomImage = !!item.imageURL;
  const { foodStatus, expirationDate, daysLeft } = item.condition;
  const statusColor = FOOD_STATUS_LABELS[foodStatus];
  const statusBgColor = FOOD_STATUS_BG_COLORS[foodStatus];
  const expiryLabel = getExpiryLabel(expirationDate, daysLeft);
  const unitLabel = getUnitLabel(item.quantity.unit);
  const isExpired = daysLeft < 0;

  return (
    <Card
      elevate
      bordered
      backgroundColor="$surface"
      borderRadius="$4"
      mb="$4"
      mx="$4"
      overflow="hidden"
      onPress={onPress}
      pressStyle={{ opacity: 0.85 }}
    >
      <XStack p="$4" ai="center" gap="$4">
        <View
          position="absolute"
          left={0}
          top={0}
          bottom={0}
          width={6}
          backgroundColor={statusColor}
        />

        <View
          ml="$2"
          w={54}
          h={54}
          br="$3"
          bg="$iconThumbnailBackground"
          bw={1}
          boc="$iconThumbnailBorder"
          ov="hidden"
        >
          <View
            f={1}
            m={1}
            br="$2"
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
          <Heading fontSize="$4" fontWeight="700">
            {item.name}
          </Heading>
          <Text
            fontSize="$3"
            color="$gray10"
          >{`${item.quantity.amount} ${unitLabel} • ${item.categoryName}`}</Text>
        </YStack>

        <YStack ai="flex-end" gap="$1">
          <View width={45} py="$1" br="$2" bg={`${statusBgColor}`} ai="center">
            <Text color={statusColor} fontWeight="800" fontSize="$3">
              {isExpired ? "만료" : `D-${daysLeft}`}
            </Text>
          </View>
          <Text fontSize={10} color="$gray9">
            {isExpired ? "기한 만료" : expiryLabel}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}
