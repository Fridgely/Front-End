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
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
import type { CategoryFormSheetProps, CategoryFormValues } from "../../../types";

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

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const [show, setShow] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isEnterAnimatingRef = useRef(false);
  const isExitAnimatingRef = useRef(false);
  const hasOpenedRef = useRef(false);

  const sheetHiddenY = useMemo(
    () => Math.max(50, Math.round(windowHeight * 0.25)),
    [windowHeight],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
    }),
  ).current;

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
    if (isExitAnimatingRef.current) return;
    isExitAnimatingRef.current = true;

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
      isExitAnimatingRef.current = false;
      if (finished) setShow(false);
    });
  }, [backdropOpacity, sheetHiddenY, sheetOpacity, translateY]);

  useEffect(() => {
    if (visible) {
      hasOpenedRef.current = true;
      setShow(true);
      requestAnimationFrame(() => {
        isEnterAnimatingRef.current = true;
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
          isEnterAnimatingRef.current = false;
          if (!visibleRef.current) {
            runClose();
          }
        });
      });
      return;
    }

    if (!hasOpenedRef.current) return;
    if (isEnterAnimatingRef.current) {
      return;
    }
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
      console.error(isEditMode ? "카테고리 수정 실패:" : "카테고리 추가 실패:", error);
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
            <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
          </Pressable>

          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity: sheetOpacity,
            }}
            {...panResponder.panHandlers}
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
                    required: "카테고리 이름을 입력해주세요.",
                    validate: (value) =>
                      value?.trim().length > 0 || "카테고리 이름을 입력해주세요.",
                    maxLength: { value: 20, message: "최대 20자까지 입력할 수 있습니다." },
                  }}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      ref={(ref) => {
                        nameInputRef.current = ref as any;
                      }}
                      value={value}
                      onChangeText={onChange}
                      placeholder="카테고리 이름"
                      h={ms(44)}
                      br="$4"
                      bg="$gray3"
                      bw={0}
                      fontFamily="$baemin"
                    />
                  )}
                />
                {errors.name && (
                  <Text color="$warning" fontSize="$3" fontWeight="600">
                    {errors.name.message}
                  </Text>
                )}
              </YStack>

              <XStack gap="$2">
                <Button
                  f={1}
                  bg="$gray3"
                  br="$4"
                  h={ms(44)}
                  onPress={onClose}
                  pressStyle={{ opacity: 0.8 }}
                >
                  <Text fontWeight="700" fontFamily="$baemin">
                    취소
                  </Text>
                </Button>
                <Button
                  f={1}
                  bg="$primary"
                  br="$4"
                  h={ms(44)}
                  disabled={isPending}
                  onPress={handleSubmit(onSubmit)}
                  pressStyle={{ opacity: 0.8 }}
                >
                  <Text fontWeight="700" color="$white" fontFamily="$baemin">
                    {isEditMode ? "수정" : "추가"}
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

