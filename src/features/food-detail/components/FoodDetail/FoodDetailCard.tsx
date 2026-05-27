import {
  FOOD_STATUS_BG_COLORS,
  FOOD_STATUS_LABELS,
  STORAGE_TYPE_LABELS,
} from "@/shared/constants/food";
import { getExpiryLabel } from "@/shared/utils/date";
import { getUnitLabel } from "@/shared/utils/food";
import { Text, View, XStack, YStack } from "tamagui";
import { FOOD_STATUS_TEXT } from "../../constants";
import { FoodDetailCardProps } from "../../types";
import { FoodDetailCardRow } from "./FoodDetailCardRow";
import { fs, ms } from "@/shared/constants/layout";

export function FoodDetailCard({ food }: FoodDetailCardProps) {
  const statusColor = FOOD_STATUS_LABELS[food.condition.foodStatus];
  const statusBgColor = FOOD_STATUS_BG_COLORS[food.condition.foodStatus];
  const expiryLabel = getExpiryLabel(
    food.condition.expirationDate,
    food.condition.daysLeft,
  );
  const unitLabel = getUnitLabel(food.quantity.unit);
  const storageLabel = STORAGE_TYPE_LABELS[food.condition.storageType];
  const statusText = FOOD_STATUS_TEXT[food.condition.foodStatus];
  const isExpired = food.condition.daysLeft < 0;

  return (
    <YStack bc="$surface" br="$5" p="$4" gap="$3">
      <YStack gap="$2">
        <XStack ai="center" jc="space-between" gap="$2">
          <Text
            color="$mainText"
            fontWeight="800"
            fontSize={fs(18)}
            fontFamily="$baemin"
            flex={1}
          >
            {food.name}
          </Text>

          <View px="$3" py="$1" br="$6" bg={statusBgColor}>
            <Text
              color={statusColor}
              fontWeight="700"
              fontFamily="$baemin"
              fontSize={fs(12)}
            >
              {statusText}
            </Text>
          </View>
        </XStack>

        <Text
          color="$gray10"
          fontFamily="$baemin"
          fontSize={fs(13)}
          lineHeight={ms(18)}
        >
          {food.description || "식품 설명이 없습니다."}
        </Text>
      </YStack>

      <View h={1} bc="$gray3" />

      <FoodDetailCardRow label="카테고리" value={food.categoryName} />
      <FoodDetailCardRow label="보관 방식" value={storageLabel} />
      <FoodDetailCardRow
        label="수량"
        value={`${food.quantity.amount} ${unitLabel}`}
      />
      <FoodDetailCardRow
        label="유통기한"
        value={isExpired ? "기한 만료" : expiryLabel}
      />
      <FoodDetailCardRow
        label="D-Day"
        value={
          isExpired
            ? "만료"
            : food.condition.daysLeft === 0
              ? "D-Day"
              : `D-${food.condition.daysLeft}`
        }
      />
    </YStack>
  );
}
