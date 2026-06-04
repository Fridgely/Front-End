import { ConfirmModal } from "@/shared/components/Modal/ConfirmModal";
import { Plus } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { Pressable } from "react-native";
import { Button, ScrollView, Text, XStack, YStack, styled } from "tamagui";
import { useAddCategoryMutation } from "../../../hooks/mutations/useAddCategoryMutation";
import { useDeleteCategoryMutation } from "../../../hooks/mutations/useDeleteCategoryMutation";
import { useUpdateCategoryMutation } from "../../../hooks/mutations/useUpdateCategoryMutation";
import type { Category, CategorySelectorProps } from "../../../types";
import { CategoryActionSheet } from "./CategoryActionSheet";
import { CategoryFormSheet } from "./CategoryFormSheet";
import { fs, ms } from "@/shared/constants/layout";

const LabelText = styled(Text, {
  fontSize: ms(16),
  fontWeight: "700",
  mb: "$2",
});

export const CategorySelector = ({
  control,
  categories,
  onModalOpenChange,
  fridgeId,
}: CategorySelectorProps) => {
  const {
    field: { value, onChange },
  } = useController({ control, name: "categoryId" });

  const [isCategorySheetOpen, setCategorySheetOpen] = useState(false);
  const [isActionSheetOpen, setActionSheetOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState<Category | null>(null);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { mutate: addCategory, isPending: isAddPending } =
    useAddCategoryMutation(fridgeId);
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateCategoryMutation(fridgeId);
  const { mutate: deleteCategory, isPending: isDeletePending } =
    useDeleteCategoryMutation(fridgeId);

  const isSheetPending = isAddPending || isUpdatePending;

  useEffect(() => {
    onModalOpenChange?.(isCategorySheetOpen);
  }, [isCategorySheetOpen, onModalOpenChange]);

  const closeSheet = () => {
    setCategorySheetOpen(false);
    setEditTarget(null);
  };

  const handleAddCategory = (name: string) => {
    addCategory(
      { name },
      {
        onSuccess: () => {
          closeSheet();
        },
      },
    );
  };

  const handleUpdateCategory = (categoryId: number, name: string) => {
    updateCategory(
      { categoryId, newName: name },
      {
        onSuccess: () => {
          closeSheet();
        },
      },
    );
  };

  const openAddSheet = () => {
    setEditTarget(null);
    setCategorySheetOpen(true);
  };

  const handleCategoryLongPress = (cat: Category) => {
    setActionTarget(cat);
    setActionSheetOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || isDeletePending) return;
    const catId = deleteTarget.id;

    deleteCategory(
      { categoryId: catId },
      {
        onSuccess: () => {
          if (value === catId) {
            const idx = categories.findIndex((c) => c.id === catId);
            const nextCategory =
              idx >= 0 ? (categories[idx + 1] ?? categories[idx - 1] ?? null) : null;
            onChange(nextCategory?.id ?? 0);
          }
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        },
        onError: () => {
          setDeleteConfirmOpen(false);
          setDeleteTarget(null);
        },
      },
    );
  };

  return (
    <YStack py="$2">
      <LabelText>카테고리</LabelText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack gap="$2" flexWrap="nowrap">
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onLongPress={() => handleCategoryLongPress(cat)}
              onPress={() => onChange(cat.id)}
            >
              <Button
                size="$3"
                br="$4"
                bg={value === cat.id ? "$primary" : "$gray3"}
                pressStyle={{ opacity: 0.7 }}
              >
                <Text
                  fontFamily="$baemin"
                  fontWeight="700"
                  fontSize={fs(13)}
                  color={value === cat.id ? "$white" : "$mainText"}
                >
                  {cat.name}
                </Text>
              </Button>
            </Pressable>
          ))}
          <Button
            size="$3"
            br="$4"
            bg="$gray3"
            icon={<Plus size={ms(16)} color="$gray10" />}
            onPress={openAddSheet}
            pressStyle={{ opacity: 0.7 }}
          >
            <Text fontFamily="$baemin" fontWeight="700" fontSize={fs(13)} color="$gray10">
              추가
            </Text>
          </Button>
        </XStack>
      </ScrollView>

      <CategoryFormSheet
        visible={isCategorySheetOpen}
        onClose={closeSheet}
        onAdd={handleAddCategory}
        editTarget={editTarget}
        onUpdate={handleUpdateCategory}
        isPending={isSheetPending}
      />

      <CategoryActionSheet
        visible={isActionSheetOpen}
        onClose={() => setActionSheetOpen(false)}
        target={actionTarget}
        onEdit={(target) => {
          setEditTarget(target);
          setCategorySheetOpen(true);
        }}
        onDelete={(target) => {
          setDeleteTarget(target);
          setDeleteConfirmOpen(true);
        }}
      />

      <ConfirmModal
        open={isDeleteConfirmOpen}
        onOpenChange={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) setDeleteTarget(null);
        }}
        title="카테고리 삭제"
        description={
          deleteTarget
            ? `${deleteTarget.name} 카테고리를 삭제할까요?  삭제 후에는 되돌릴 수 없습니다.`
            : ""
        }
        confirmText="삭제하기"
        onConfirm={handleConfirmDelete}
        confirmColor="$warning"
        closeOnConfirm={false}
        confirmDisabled={isDeletePending}
      />
    </YStack>
  );
};

