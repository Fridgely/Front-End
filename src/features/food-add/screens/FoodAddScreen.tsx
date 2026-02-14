import { Header } from "@/shared/components/Header/Header";
import { useSelectedFridgeId } from "@/shared/stores/useFridgeStore";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, ScrollView, Text, YStack } from "tamagui";
import { CategorySelector } from "../components/CategorySelector";
import { ExpiryDatePicker } from "../components/ExpiryDatePicker/ExpiryDatePicker";
import { FoodNameInput } from "../components/FoodNameInput";
import { ImageUploader } from "../components/ImageUploader";
import { QuantityInput } from "../components/QuantityInput/QuantityInput";
import { StorageSelector } from "../components/StorageSelector";
import { useAddFoodMutation } from "../hooks/mutations/useAddFoodMutation";
import { FoodFormValues } from "../types";

export function FoodAddScreen() {
  const selectedFridgeId = useSelectedFridgeId();
  const { mutate: addFood } = useAddFoodMutation(selectedFridgeId!);
  const { control, handleSubmit } = useForm<FoodFormValues>({
    defaultValues: {
      name: "",
      categoryId: 0,
      storageType: "REFRIGERATION",
      expirationDate: new Date(),
      amount: 1,
      unit: "PIECE",
    },
  });

  const onSubmit = (data: FoodFormValues) => {
    addFood(data);
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 추가" showBackButton />
      <ScrollView f={1} showsVerticalScrollIndicator={false}>
        <YStack p="$4" gap="$5" pb="$10">
          <ImageUploader control={control} />
          <FoodNameInput control={control} />
          {selectedFridgeId !== null && (
            <CategorySelector control={control} fridgeId={selectedFridgeId} />
          )}
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
