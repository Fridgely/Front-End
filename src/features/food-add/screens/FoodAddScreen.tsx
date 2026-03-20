import { useFridgeQuery } from "@/features/home/hooks/queries/useFridgeQuery";
import { Header } from "@/shared/components/Header/Header";
import {
  useFridgeActions,
  useSelectedFridgeId,
} from "@/shared/stores/useFridgeStore";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";
import { CategorySelector } from "../components/CategorySelector/CategorySelector";
import { ExpiryDatePicker } from "../components/ExpiryDatePicker/ExpiryDatePicker";
import { FoodNameInput } from "../components/FoodNameInput";
import { ImageUploader } from "../components/ImageUploader";
import { QuantityInput } from "../components/QuantityInput/QuantityInput";
import { StorageSelector } from "../components/StorageSelector";
import { useAddFoodMutation } from "../hooks/mutations/useAddFoodMutation";
import { useCategoryQuery } from "../hooks/queries/useCategoryQuery";
import { FoodFormValues } from "../types";

export function FoodAddScreen() {
  const selectedFridgeId = useSelectedFridgeId();
  const { setSelectedFridgeId } = useFridgeActions();
  const { data: fridgeData } = useFridgeQuery();
  const fridges = useMemo(() => fridgeData?.data ?? [], [fridgeData?.data]);

  const [targetFridgeId, setTargetFridgeId] = useState<number | null>(
    selectedFridgeId,
  );
  const { data: categoryData } = useCategoryQuery(targetFridgeId);
  const categories = useMemo(
    () => categoryData?.data ?? [],
    [categoryData?.data],
  );

  const { mutate: addFood, isPending } = useAddFoodMutation(
    targetFridgeId ?? 0,
  );
  const { control, handleSubmit, setValue } = useForm<FoodFormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      categoryId: 0,
      storageType: "REFRIGERATION",
      expirationDate: new Date(),
      amount: 1,
      unit: "PIECE",
    },
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    if (targetFridgeId === null && fridges.length > 0) {
      const firstFridgeId = fridges[0].id;
      setTargetFridgeId(firstFridgeId);
      setSelectedFridgeId(firstFridgeId);
    }
  }, [fridges, setSelectedFridgeId, targetFridgeId]);

  // 데이터 로드 시 첫 번째 값 설정
  useEffect(() => {
    if (categories.length > 0) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, setValue]);

  const onSubmit = (data: FoodFormValues) => {
    if (targetFridgeId === null) {
      Toast.show({
        type: "error",
        text1: "등록할 냉장고를 선택해주세요.",
      });
      return;
    }

    addFood(data);
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 추가" showBackButton />
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$5" pb="$10">
          <YStack gap="$2">
            <Text fontFamily="$baemin" fontSize="$4" color="$mainText">
              등록 냉장고
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap="$2">
                {fridges.map((fridge) => {
                  const isActive = targetFridgeId === fridge.id;
                  return (
                    <Button
                      key={fridge.id}
                      onPress={() => {
                        setTargetFridgeId(fridge.id);
                        setSelectedFridgeId(fridge.id);
                      }}
                      bg={isActive ? "$primary" : "$gray3"}
                      borderWidth={1}
                      borderColor={isActive ? "$primary" : "$gray3"}
                      size="$4"
                      br="$4"
                      px="$4"
                    >
                      <Text fontFamily="$baemin" color="$mainText">
                        {fridge.name}
                      </Text>
                    </Button>
                  );
                })}
              </XStack>
            </ScrollView>
          </YStack>

          <ImageUploader control={control} />
          <FoodNameInput control={control} />
          {targetFridgeId !== null && (
            <CategorySelector
              control={control}
              categories={categories}
              onModalOpenChange={setIsCategoryModalOpen}
              fridgeId={targetFridgeId}
            />
          )}
          <StorageSelector control={control} />
          <ExpiryDatePicker control={control} />
          <QuantityInput control={control} />
        </YStack>
      </ScrollView>

      {!isCategoryModalOpen && (
        <YStack p="$4" pb="$6" backgroundColor="$background">
          <Button
            backgroundColor="$primary"
            size="$6"
            br="$3"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || targetFridgeId === null}
          >
            <Text
              color="$mainText"
              fontWeight="700"
              fontSize="$5"
              fontFamily="$baemin"
            >
              식품 등록
            </Text>
          </Button>
        </YStack>
      )}
    </YStack>
  );
}
