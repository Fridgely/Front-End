import { Header } from "@/shared/components/Header/Header";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Spinner, YStack } from "tamagui";
import { FoodDetailCard } from "../components/FoodDetail/FoodDetailCard";
import { FoodStatusView } from "../components/FoodStatusView";
import { ImageSection } from "../components/ImageSection";
import { useFoodDetailQuery } from "../hooks/queries/useFoodDetailQuery";
import { parseParamToNumber } from "../utils/params";

export function FoodDetailScreen() {
  const { id, refrigeratorId } = useLocalSearchParams<{
    id?: string;
    refrigeratorId?: string;
  }>();

  const foodId = parseParamToNumber(id);
  const targetRefrigeratorId = parseParamToNumber(refrigeratorId);

  const { data: foodDetail, isLoading } = useFoodDetailQuery(
    targetRefrigeratorId,
    foodId,
  );

  const food = foodDetail?.data;

  if (foodId === null) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 상세" showBackButton />
        <FoodStatusView title="잘못된 식품 경로입니다." />
      </YStack>
    );
  }

  if (targetRefrigeratorId === null) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 상세" showBackButton />
        <FoodStatusView
          title="냉장고 정보가 필요해요."
          description="목록에서 다시 선택해 주세요."
        />
      </YStack>
    );
  }

  if (isLoading) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 상세" showBackButton />
        <YStack f={1} ai="center" jc="center">
          <Spinner color="$primary" size="large" />
        </YStack>
      </YStack>
    );
  }

  if (!food) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 상세" showBackButton />
        <FoodStatusView
          title="식품 정보를 불러오지 못했어요."
          description="잠시 후 다시 시도해 주세요."
        />
      </YStack>
    );
  }

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 상세" showBackButton />

      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack px="$4" py="$5" gap="$4" pb="$10">
          <ImageSection imageURL={food.imageURL} />
          <FoodDetailCard food={food} />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
