import { useFridgeQuery } from "@/features/home/hooks/queries/useFridgeQuery";
import { Header } from "@/shared/components/Header/Header";
import {
  useFridgeActions,
  useIsAllFridgeTab,
  useSelectedFridgeId,
} from "@/shared/stores/useFridgeStore";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const EXTRA_SCROLL_HEIGHT = 180;

export function FoodAddScreen() {
  const insets = useSafeAreaInsets();
  const selectedFridgeId = useSelectedFridgeId();
  const isAllFridgeTab = useIsAllFridgeTab();
  const { setSelectedFridgeId } = useFridgeActions();
  const isFocused = useIsFocused();
  const { data: fridgeData } = useFridgeQuery();
  const fridges = useMemo(() => fridgeData?.data ?? [], [fridgeData?.data]);

  const [targetFridgeId, setTargetFridgeId] = useState<number | null>(null);
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    isFetching: isCategoryFetching,
  } = useCategoryQuery(targetFridgeId);
  const categories = useMemo(
    () => categoryData?.data ?? [],
    [categoryData?.data],
  );

  const { mutate: addFood, isPending } = useAddFoodMutation(
    targetFridgeId ?? 0,
  );
  const { control, handleSubmit, setValue, watch } = useForm<FoodFormValues>({
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
  const selectedCategoryId = watch("categoryId");
  const isCategoryValid = categories.some(
    (category) => category.id === selectedCategoryId,
  );
  const isTargetReady = targetFridgeId !== null;
  const isCategoryReady =
    isTargetReady &&
    !isCategoryLoading &&
    !isCategoryFetching &&
    categories.length > 0 &&
    isCategoryValid;
  const wasFocusedRef = useRef(false);
  const keyboardScrollRef = useRef<any>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (isFocused && !wasFocusedRef.current) {
      if (isAllFridgeTab) {
        setTargetFridgeId(null);
      } else {
        setTargetFridgeId(selectedFridgeId);
      }

      setValue("categoryId", 0);
    }

    wasFocusedRef.current = isFocused;
  }, [isAllFridgeTab, isFocused, selectedFridgeId, setValue]);

  useEffect(() => {
    if (targetFridgeId !== null) {
      setValue("categoryId", 0);
    }
  }, [targetFridgeId, setValue]);

  // 데이터 로드 시 첫 번째 값 설정
  useEffect(() => {
    if (categories.length > 0 && !isCategoryValid) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, isCategoryValid, setValue]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onSubmit = (data: FoodFormValues) => {
    if (!isTargetReady) {
      Toast.show({
        type: "error",
        text1: "등록할 냉장고를 선택해주세요.",
      });
      return;
    }

    if (!isCategoryReady) {
      Toast.show({
        type: "error",
        text1: "카테고리 준비 후 다시 시도해주세요.",
      });
      return;
    }

    addFood(data);
  };

  const handleAmountFocus = () => {
    // 키보드가 올라올 때 수량 입력란이 가려지는 문제 해결을 위해 스크롤뷰를 맨 아래로 스크롤
    keyboardScrollRef.current?.scrollToEnd?.({ animated: true });
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="식품 추가" showBackButton />
      <KeyboardAwareScrollView
        // 폼이 길어서 KeyboardAvoidingView 말고 AwareScrollView 사용
        innerRef={(ref) => {
          keyboardScrollRef.current = ref;
        }}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 65 + 24,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={EXTRA_SCROLL_HEIGHT}
        showsVerticalScrollIndicator={false}
      >
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
          <QuantityInput control={control} onInputFocus={handleAmountFocus} />
        </YStack>
      </KeyboardAwareScrollView>

      {!isCategoryModalOpen && !isKeyboardVisible && (
        <YStack
          p="$4"
          backgroundColor="$background"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Button
            backgroundColor="$primary"
            size="$6"
            br="$3"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending || !isTargetReady || !isCategoryReady}
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
