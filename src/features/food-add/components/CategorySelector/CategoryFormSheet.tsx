import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  AnimatePresence,
  Button,
  Input,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { CategoryFormSheetProps, CategoryFormValues } from "../../types";

export const CategoryFormSheet = ({
  visible,
  onClose,
  onAdd,
  editTarget = null,
  onUpdate,
  isPending = false,
}: CategoryFormSheetProps) => {
  const isEditMode = Boolean(editTarget);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    mode: "onChange",
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!visible) {
      reset({ name: "" });
      setIsKeyboardVisible(false);
    } else {
      reset({ name: editTarget?.name ?? "" });
    }
  }, [visible, editTarget, reset]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSubmit = async ({ name }: CategoryFormValues) => {
    if (isPending) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    try {
      if (isEditMode && editTarget && onUpdate) {
        await onUpdate(editTarget.id, trimmedName);
      } else {
        await onAdd(trimmedName);
      }
    } catch (error) {
      console.error(
        isEditMode ? "카테고리 수정 실패:" : "카테고리 추가 실패:",
        error,
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : isKeyboardVisible
              ? "height"
              : undefined
        }
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <YStack f={1} jc="flex-end">
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          />

          <AnimatePresence>
            {visible && (
              <YStack
                key="category-form-sheet"
                bg="$background"
                p="$5"
                pb="$5"
                gap="$4"
                br="$6"
                borderBottomLeftRadius={0}
                borderBottomRightRadius={0}
                zIndex={100}
                animation="quick"
                enterStyle={{ y: 50, opacity: 0 }}
                exitStyle={{ y: 50, opacity: 0 }}
                y={0}
                opacity={1}
              >
                <View
                  w={40}
                  h={5}
                  bg="$gray4"
                  br="$4"
                  alignSelf="center"
                  mb="$2"
                />

                <Text fontSize="$5" fontWeight="700" fontFamily="$baemin">
                  {isEditMode ? "카테고리 수정" : "카테고리 추가"}
                </Text>

                <YStack gap="$2">
                  <Controller
                    control={control}
                    name="name"
                    rules={{
                      required: "이름을 입력해주세요.",
                      validate: (v) =>
                        v.trim().length > 0 || "공백은 입력할 수 없습니다.",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        autoFocus={!isEditMode}
                        h={52}
                        placeholder={
                          isEditMode ? "카테고리 이름" : "새 카테고리 이름"
                        }
                        value={value}
                        onChangeText={onChange}
                        backgroundColor="$gray3"
                        br="$4"
                        bw={errors.name ? 1 : 0}
                        boc="$warning"
                        fontSize="$4"
                        fontFamily="$baemin"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        returnKeyType="done"
                      />
                    )}
                  />
                </YStack>

                <XStack>
                  <Button
                    flex={1}
                    backgroundColor="$primary"
                    h={52}
                    br="$4"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                    pressStyle={{ scale: 0.97 }}
                  >
                    <Text
                      color="$mainText"
                      fontWeight="700"
                      fontSize="$4"
                      fontFamily="$baemin"
                    >
                      {isEditMode ? "저장하기" : "추가하기"}
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            )}
          </AnimatePresence>
        </YStack>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
