import { Plus } from "@tamagui/lucide-icons";
import React from "react";
import { Controller } from "react-hook-form";
import { Button, ScrollView, Text, XStack, YStack, styled } from "tamagui";
import { CategorySelectorProps } from "../types";

const LabelText = styled(Text, { fontSize: 18, fontWeight: "700", mb: "$2" });

export const CategorySelector = ({
  control,
  categories,
}: CategorySelectorProps) => {
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
                onPress={() => {
                  // TODO: 카테고리 추가 로직 구현
                  console.log("카테고리 추가 클릭");
                }}
              >
                <Text fontFamily="$baemin" fontSize="$3" color="$mainText">
                  추가
                </Text>
              </Button>
            </XStack>
          </ScrollView>
        </YStack>
      )}
    />
  );
};
