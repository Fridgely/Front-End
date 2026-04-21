import { Header } from "@/shared/components/Header/Header";
import { fs, getBottomPaddingForSheet, ms } from "@/shared/constants/layout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, ScrollView, Spinner, Text, YStack } from "tamagui";
import { FoodDetailCard } from "../components/FoodDetail/FoodDetailCard";
import { FoodStatusView } from "../components/FoodStatusView";
import { ImageSection } from "../components/ImageSection";
import { useFoodDetailQuery } from "../hooks/queries/useFoodDetailQuery";
import { parseParamToNumber } from "../utils/params";

export function FoodDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const bottomPadding = getBottomPaddingForSheet({ bottomInset: insets.bottom });

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 상세" showBackButton />

      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack
          px="$4"
          py="$5"
          gap="$4"
          style={{ paddingBottom: bottomPadding }}
        >
          <ImageSection imageURL={food.imageURL} />
          <FoodDetailCard food={food} />
          <Button
            backgroundColor="$primary"
            size="$5"
            br="$3"
            h={ms(48)}
            onPress={() => {
              router.push({
                pathname: "/food-edit",
                params: {
                  id: food.id.toString(),
                  refrigeratorId: targetRefrigeratorId.toString(),
                },
              } as any);
            }}
          >
            <Text
              color="$mainText"
              fontWeight="700"
              fontSize={fs(14)}
              fontFamily="$baemin"
            >
              수정하기
            </Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
