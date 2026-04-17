import { ConfirmModal } from "@/shared/components/Modal/ConfirmModal";
import { Plus } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { useController } from "react-hook-form";
import { Pressable } from "react-native";
import { Button, ScrollView, Text, XStack, YStack, styled } from "tamagui";
import { useAddCategoryMutation } from "../../hooks/mutations/useAddCategoryMutation";
import { useDeleteCategoryMutation } from "../../hooks/mutations/useDeleteCategoryMutation";
import { useUpdateCategoryMutation } from "../../hooks/mutations/useUpdateCategoryMutation";
import { Category, CategorySelectorProps } from "../../types";
import { CategoryActionSheet } from "./CategoryActionSheet";
import { CategoryFormSheet } from "./CategoryFormSheet";

const LabelText = styled(Text, { fontSize: 18, fontWeight: "700", mb: "$2" });

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
  const { mutate: deleteCategory } = useDeleteCategoryMutation(fridgeId);

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
    if (!deleteTarget) return;
    const catId = deleteTarget.id;
    deleteCategory(
      { categoryId: catId },
      {
        onSuccess: () => {
          if (value === catId) {
            const next = categories.find((c) => c.id !== catId);
            if (next) onChange(next.id);
          }
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
              onPress={() => onChange(cat.id)}
              onLongPress={() => handleCategoryLongPress(cat)}
              delayLongPress={450}
            >
              <Button
                pointerEvents="none"
                backgroundColor={value === cat.id ? "$primary" : "$gray3"}
                color="$mainText"
                br="$4"
                size="$4"
                fontFamily="$baemin"
                fontSize="$3"
                px="$4"
              >
                {cat.name}
              </Button>
            </Pressable>
          ))}

          <Button
            icon={<Plus size="$1" color="$mainText" />}
            size="$4"
            bg="$gray3"
            br="$4"
            px="$4"
            onPress={openAddSheet}
          >
            <Text fontFamily="$baemin" fontSize="$3" color="$mainText">
              추가
            </Text>
          </Button>
        </XStack>
      </ScrollView>
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
      <CategoryFormSheet
        visible={isCategorySheetOpen}
        onClose={closeSheet}
        onAdd={handleAddCategory}
        editTarget={editTarget}
        onUpdate={handleUpdateCategory}
        isPending={isSheetPending}
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
      />
    </YStack>
  );
};
