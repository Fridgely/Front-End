import { getBottomPaddingForSheet, ms, s } from "@/shared/constants/layout";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Easing,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
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
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const nameInputRef = useRef<TextInput | null>(null);

  const [show, setShow] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);
  const hasOpenedRef = useRef(false);

  const sheetHiddenY = useMemo(
    () => Math.max(50, Math.round(windowHeight * 0.25)),
    [windowHeight],
  );

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

  const runClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetOpacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: sheetHiddenY,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      isAnimatingRef.current = false;
      if (finished) setShow(false);
    });
  }, [backdropOpacity, sheetHiddenY, sheetOpacity, translateY]);

  useEffect(() => {
    if (visible) {
      hasOpenedRef.current = true;
      setShow(true);
      requestAnimationFrame(() => {
        isAnimatingRef.current = true;
        translateY.setValue(sheetHiddenY);
        sheetOpacity.setValue(0);
        backdropOpacity.setValue(0);
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 160,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sheetOpacity, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(() => {
          isAnimatingRef.current = false;
        });
      });
      return;
    }

    if (!hasOpenedRef.current) return;
    runClose();
  }, [backdropOpacity, runClose, sheetHiddenY, sheetOpacity, translateY, visible]);

  useEffect(() => {
    if (!visible || !show || isEditMode) return;
    const task = InteractionManager.runAfterInteractions(() => {
      nameInputRef.current?.focus();
    });
    return () => task.cancel();
  }, [visible, show, isEditMode]);

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
      visible={show}
      transparent
      animationType="none"
      onRequestClose={onClose}
      hardwareAccelerated
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
            style={StyleSheet.absoluteFill}
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }}
          >
            <Animated.View
              style={[styles.backdrop, { opacity: backdropOpacity }]}
            />
          </Pressable>

          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity: sheetOpacity,
            }}
          >
            <YStack
              bg="$background"
              p="$5"
              pb={getBottomPaddingForSheet({ bottomInset: insets.bottom })}
              gap="$4"
              br="$6"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              zIndex={100}
            >
              <View
                w={s(40)}
                h={s(5)}
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
                      ref={nameInputRef}
                      h={ms(48)}
                      placeholder={
                        isEditMode ? "카테고리 이름" : "새 카테고리 이름"
                      }
                      value={value}
                      onChangeText={onChange}
                      backgroundColor="$gray3"
                      br="$4"
                      bw={errors.name ? 1 : 0}
                      boc="$warning"
                      fontSize="$2"
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
                  h={ms(48)}
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
          </Animated.View>
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
