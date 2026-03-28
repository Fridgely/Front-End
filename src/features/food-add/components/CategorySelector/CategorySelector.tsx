import { Plus } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Button, ScrollView, Text, XStack, YStack, styled } from "tamagui";
import { useAddCategoryMutation } from "../../hooks/mutations/useAddCategoryMutation";
import { CategorySelectorProps } from "../../types";
import { CategoryAddSheet } from "./CategoryAddSheet";

const LabelText = styled(Text, { fontSize: 18, fontWeight: "700", mb: "$2" });

export const CategorySelector = ({
  control,
  categories,
  onModalOpenChange,
  fridgeId,
}: CategorySelectorProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { mutate: addCategory, isPending } = useAddCategoryMutation(fridgeId);

  useEffect(() => {
    onModalOpenChange?.(isAddModalOpen);
  }, [isAddModalOpen, onModalOpenChange]);

  const closeModal = () => setIsAddModalOpen(false);

  const handleAddCategory = (name: string) => {
    addCategory(
      { name },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };
  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field: { onChange, value } }) => (
        <YStack py="$2">
          <LabelText>카테고리</LabelText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" flexWrap="nowrap">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  backgroundColor={value === cat.id ? "$primary" : "$gray3"}
                  color="$mainText"
                  onPress={() => onChange(cat.id)}
                  br="$4"
                  size="$4"
                  fontFamily="$baemin"
                  fontSize="$3"
                  px="$4"
                >
                  {cat.name}
                </Button>
              ))}

              <Button
                icon={<Plus size="$1" color="$mainText" />}
                size="$4"
                bg="$gray3"
                br="$4"
                px="$4"
                onPress={() => setIsAddModalOpen(true)}
              >
                <Text fontFamily="$baemin" fontSize="$3" color="$mainText">
                  추가
                </Text>
              </Button>
            </XStack>
          </ScrollView>
          <CategoryAddSheet
            visible={isAddModalOpen}
            onClose={closeModal}
            onAdd={handleAddCategory}
            isPending={isPending}
          />
        </YStack>
      )}
    />
  );
};
