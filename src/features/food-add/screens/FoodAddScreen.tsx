import { Header } from "@/shared/components/Header/Header";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, ScrollView, Text, YStack } from "tamagui";
import { CategorySelector } from "../components/CategorySelecotr";
import { ExpiryDatePicker } from "../components/ExpiryDatePicker/ExpiryDatePicker";
import { FoodNameInput } from "../components/FoodNameInput";
import { ImageUploader } from "../components/ImageUploader";
import { QuantityInput } from "../components/QuantityInput/QuantityInput";
import { StorageSelector } from "../components/StorageSelector";
import { FoodFormValues } from "../types";

export function FoodAddScreen() {
  const { control, handleSubmit } = useForm<FoodFormValues>({
    defaultValues: {
      imageURL: null,
      name: "",
      categoryId: 1,
      storageType: "REFRIGERATOR",
      expirationDate: "2023.12.31",
      amount: 1,
      unit: "개",
    },
  });

  const tempCategories = [
    { id: 1, name: "유제품", isDefaultType: true },
    { id: 2, name: "육류", isDefaultType: true },
    { id: 3, name: "채소", isDefaultType: true },
    { id: 4, name: "과일", isDefaultType: true },
  ];

  const onSubmit = (data: FoodFormValues) => {
    console.log("최종 제출 데이터:", data);
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 추가" showBackButton />
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$5" pb="$10">
          <ImageUploader control={control} />
          <FoodNameInput control={control} />
          <CategorySelector control={control} categories={tempCategories} />
          <StorageSelector control={control} />
          <ExpiryDatePicker control={control} />
          <QuantityInput control={control} />
        </YStack>
      </ScrollView>

      <YStack p="$4" pb="$6" backgroundColor="$background">
        <Button
          backgroundColor="$primary"
          size="$6"
          br="$3"
          onPress={handleSubmit(onSubmit)}
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
    </YStack>
  );
}
