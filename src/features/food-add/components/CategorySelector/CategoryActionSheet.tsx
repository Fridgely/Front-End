import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { CategoryActionSheetProps } from "../../types";
import { getBottomPaddingForSheet, ms, s } from "@/shared/constants/layout";

export const CategoryActionSheet = ({
  visible,
  onClose,
  target,
  onEdit,
  onDelete,
}: CategoryActionSheetProps) => {
  const isDefaultType = Boolean(target?.isDefaultType);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const [show, setShow] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isEnterAnimatingRef = useRef(false);
  const isExitAnimatingRef = useRef(false);
  const pendingAfterCloseRef = useRef<(() => void) | null>(null);
  const hasOpenedRef = useRef(false);

  const sheetHiddenY = useMemo(
    () => Math.max(50, Math.round(windowHeight * 0.25)),
    [windowHeight],
  );

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
      if (finished) {
        setShow(false);
        const next = pendingAfterCloseRef.current;
        pendingAfterCloseRef.current = null;
        next?.();
      }
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

  return (
    <Modal
      visible={show}
      transparent
      animationType="none"
      onRequestClose={onClose}
      hardwareAccelerated
      statusBarTranslucent
    >
      <YStack f={1} jc="flex-end">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
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

            <YStack gap="$2" ai="center">
              <Text fontSize="$5" fontWeight="700" fontFamily="$baemin">
                {target?.name ?? "카테고리"}
              </Text>
              <Text
                fontSize="$3"
                color="$gray10"
                textAlign="center"
                fontFamily="$baemin"
              >
                {isDefaultType
                  ? "기본 카테고리는 수정하거나 삭제할 수 없습니다."
                  : "원하는 작업을 선택해주세요."}
              </Text>
            </YStack>

            {isDefaultType ? (
              <XStack>
                <Button
                  flex={1}
                  backgroundColor="$gray3"
                  h={ms(48)}
                  br="$4"
                  onPress={onClose}
                  pressStyle={{ scale: 0.97 }}
                >
                  <Text color="$mainText" fontWeight="700" fontSize="$4">
                    확인
                  </Text>
                </Button>
              </XStack>
            ) : (
              <YStack gap="$2">
                <Button
                  backgroundColor="$primary"
                  h={ms(48)}
                  br="$4"
                  onPress={() => {
                    if (!target) return;
                    pendingAfterCloseRef.current = () => onEdit(target);
                    onClose();
                  }}
                  pressStyle={{ scale: 0.97 }}
                >
                  <Text
                    color="$mainText"
                    fontWeight="700"
                    fontSize="$4"
                    fontFamily="$baemin"
                  >
                    이름 수정
                  </Text>
                </Button>

                <Button
                  backgroundColor="$warning"
                  h={ms(48)}
                  br="$4"
                  onPress={() => {
                    if (!target) return;
                    pendingAfterCloseRef.current = () => onDelete(target);
                    onClose();
                  }}
                  pressStyle={{ scale: 0.97 }}
                >
                  <Text color="$white" fontWeight="700" fontSize="$4">
                    삭제
                  </Text>
                </Button>

                <Button
                  backgroundColor="$gray3"
                  h={ms(48)}
                  br="$4"
                  onPress={onClose}
                  pressStyle={{ scale: 0.97 }}
                >
                  <Text
                    color="$mainText"
                    fontWeight="700"
                    fontSize="$4"
                    fontFamily="$baemin"
                  >
                    취소
                  </Text>
                </Button>
              </YStack>
            )}
          </YStack>
        </Animated.View>
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
