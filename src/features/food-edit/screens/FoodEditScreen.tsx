import { CategorySelector } from "@/features/food-add/components/CategorySelector/CategorySelector";
import { ExpiryDatePicker } from "@/features/food-add/components/ExpiryDatePicker/ExpiryDatePicker";
import { FoodNameInput } from "@/features/food-add/components/FoodNameInput";
import { QuantityInput } from "@/features/food-add/components/QuantityInput/QuantityInput";
import { StorageSelector } from "@/features/food-add/components/StorageSelector";
import { useCategoryQuery } from "@/features/food-add/hooks/queries/useCategoryQuery";
import { FoodFormValues } from "@/features/food-add/types";
import { useFoodDetailQuery } from "@/features/food-detail/hooks/queries/useFoodDetailQuery";
import { parseParamToNumber } from "@/features/food-detail/utils/params";
import { Header } from "@/shared/components/Header/Header";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import {
  Button,
  Input,
  ScrollView,
  Spinner,
  Text,
  YStack,
  styled,
} from "tamagui";
import { useUpdateFoodMutation } from "../hooks/mutations/useUpdateFoodMutation";

const LabelText = styled(Text, {
  fontFamily: "$heading",
  fontSize: "$4",
  fontWeight: "700",
  mb: "$2",
});

export function FoodEditScreen() {
  const { id, refrigeratorId } = useLocalSearchParams<{
    id?: string;
    refrigeratorId?: string;
  }>();

  const foodId = parseParamToNumber(id);
  const targetRefrigeratorId = parseParamToNumber(refrigeratorId);
  const [isDetailQueryEnabled, setIsDetailQueryEnabled] = useState(true);

  const { data: foodDetail, isLoading: isFoodLoading } = useFoodDetailQuery(
    targetRefrigeratorId,
    foodId,
    isDetailQueryEnabled,
  );
  const food = foodDetail?.data;

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useCategoryQuery(targetRefrigeratorId);
  const categories = useMemo(
    () => categoryData?.data ?? [],
    [categoryData?.data],
  );

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const initializedRef = useRef(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<FoodFormValues>({
      mode: "onChange",
      defaultValues: {
        name: "",
        categoryId: 0,
        storageType: "REFRIGERATION",
        expirationDate: new Date(),
        amount: 1,
        unit: "PIECE",
        description: "",
      },
    });

  const selectedCategoryId = watch("categoryId");
  const isCategoryValid = categories.some(
    (category) => category.id === selectedCategoryId,
  );

  useEffect(() => {
    if (!food || initializedRef.current) {
      return;
    }

    const expirationDate = new Date(food.condition.expirationDate);
    const defaultCategoryId =
      typeof (food as any).categoryId === "number"
        ? (food as any).categoryId
        : 0;

    reset({
      name: food.name,
      categoryId: defaultCategoryId,
      storageType: food.condition.storageType,
      expirationDate: Number.isNaN(expirationDate.getTime())
        ? new Date()
        : expirationDate,
      amount: food.quantity.amount,
      unit: food.quantity.unit,
      description: food.description ?? "",
    });

    initializedRef.current = true;
    setIsDetailQueryEnabled(false);
  }, [food, reset]);

  useEffect(() => {
    if (!food || categories.length === 0 || isCategoryValid) {
      return;
    }

    const matchedByName = categories.find(
      (category) => category.name === food.categoryName,
    );

    setValue("categoryId", matchedByName?.id ?? categories[0].id);
  }, [categories, food, isCategoryValid, setValue]);

  const { mutate: updateFood, isPending } = useUpdateFoodMutation(
    targetRefrigeratorId ?? 0,
    foodId ?? 0,
  );

  const onSubmit = (values: FoodFormValues) => {
    if (targetRefrigeratorId === null || foodId === null) {
      Toast.show({
        type: "error",
        text1: "잘못된 요청입니다.",
      });
      return;
    }

    let categoryId = values.categoryId;

    if (!isCategoryValid) {
      const fallbackCategoryId = categories[0]?.id;

      if (!fallbackCategoryId) {
        Toast.show({
          type: "error",
          text1: "카테고리 선택 후 다시 시도해주세요.",
        });
        return;
      }

      categoryId = fallbackCategoryId;
      setValue("categoryId", fallbackCategoryId);
    }

    updateFood({
      ...values,
      categoryId,
      description: values.description?.trim() || "",
    });
  };

  if (foodId === null || targetRefrigeratorId === null) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 수정" showBackButton />
        <YStack f={1} ai="center" jc="center" px="$4">
          <Text color="$gray10" fontFamily="$baemin">
            수정할 식품 정보를 찾을 수 없습니다.
          </Text>
        </YStack>
      </YStack>
    );
  }

  if (isFoodLoading || isCategoryLoading || isCategoryFetching) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 수정" showBackButton />
        <YStack f={1} ai="center" jc="center">
          <Spinner color="$primary" size="large" />
        </YStack>
      </YStack>
    );
  }

  if (!food) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header title="식품 수정" showBackButton />
        <YStack f={1} ai="center" jc="center" px="$4">
          <Text color="$gray10" fontFamily="$baemin">
            식품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 수정" showBackButton />

      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$5" pb="$10">
          <FoodNameInput control={control} />
          <CategorySelector
            control={control}
            categories={categories}
            onModalOpenChange={setIsCategoryModalOpen}
            fridgeId={targetRefrigeratorId}
          />
          <StorageSelector control={control} />
          <ExpiryDatePicker control={control} />
          <QuantityInput control={control} />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <YStack>
                <LabelText>메모</LabelText>
                <Input
                  h={50}
                  value={value || ""}
                  onChangeText={onChange}
                  placeholder="메모를 입력하세요"
                  backgroundColor="$gray3"
                  fontSize="$3"
                  fontFamily="$baemin"
                  fontWeight="400"
                  br="$4"
                  bw={0}
                />
              </YStack>
            )}
          />
        </YStack>
      </ScrollView>

      {!isCategoryModalOpen && (
        <YStack p="$4" pb="$6" backgroundColor="$background">
          <Button
            backgroundColor="$primary"
            size="$6"
            br="$3"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            <Text
              color="$mainText"
              fontWeight="700"
              fontSize="$5"
              fontFamily="$baemin"
            >
              수정 완료
            </Text>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
