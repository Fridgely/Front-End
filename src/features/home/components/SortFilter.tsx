import { fs, getBottomPaddingForSheet, ms, s } from "@/shared/constants/layout";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, View, XStack, YStack } from "tamagui";
import { SortFilterProps, SortOption } from "../types";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "유통기한 임박순", value: "EXPIRY_ASC" },
  { label: "등록일순", value: "REGISTERED_DESC" },
  { label: "이름순", value: "NAME_ASC" },
];

export function SortFilter({
  visible,
  onClose,
  selectedSort,
  selectedCategory,
  categories,
  onApply,
}: SortFilterProps) {
  // selected 겹치므로 draft
  const [draftSort, setDraftSort] = useState<SortOption>(selectedSort);
  const [draftCategory, setDraftCategory] = useState(selectedCategory);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const [show, setShow] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isEnterAnimatingRef = useRef(false);
  const isExitAnimatingRef = useRef(false);
  const hasOpenedRef = useRef(false);

  const sheetHiddenY = useMemo(
    () => Math.max(60, Math.round(windowHeight * 0.2)),
    [windowHeight],
  );

  useEffect(() => {
    if (!visible) return;
    setDraftSort(selectedSort);
    setDraftCategory(selectedCategory);
  }, [visible, selectedSort, selectedCategory]);

  const requestClose = useCallback(
    (notifyParent: boolean) => {
      if (isExitAnimatingRef.current) return;
      isExitAnimatingRef.current = true;
      dragY.stopAnimation();

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
          dragY.setValue(0);
          translateY.setValue(0);
          setShow(false);
          if (notifyParent) onClose();
        }
      });
    },
    [backdropOpacity, dragY, onClose, sheetHiddenY, sheetOpacity, translateY],
  );

  useEffect(() => {
    if (visible) {
      hasOpenedRef.current = true;
      setShow(true);
      requestAnimationFrame(() => {
        isEnterAnimatingRef.current = true;
        translateY.setValue(sheetHiddenY);
        dragY.setValue(0);
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
            requestClose(false);
          }
        });
      });
      return;
    }

    if (!hasOpenedRef.current) return;
    if (isEnterAnimatingRef.current) return;
    requestClose(false);
  }, [
    backdropOpacity,
    dragY,
    requestClose,
    sheetHiddenY,
    sheetOpacity,
    translateY,
    visible,
  ]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          requestClose(true);
        } else {
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(dragY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      },
    }),
  ).current;

  return (
    <Modal
      visible={show}
      transparent
      animationType="none"
      onRequestClose={() => requestClose(true)}
      statusBarTranslucent
    >
      <YStack f={1} jc="flex-end">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => requestClose(true)}
        >
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </Pressable>

        <Animated.View
          style={{
            transform: [{ translateY: Animated.add(translateY, dragY) }],
            opacity: sheetOpacity,
          }}
          {...panResponder.panHandlers}
        >
          <YStack
            key="sort-filter-sheet"
            bg="$background"
            p="$5"
            pb={getBottomPaddingForSheet({ bottomInset: insets.bottom })}
            gap="$5"
            br="$6"
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
          >
            <View w={s(56)} h={s(6)} bg="$gray4" br="$4" alignSelf="center" />

            <XStack ai="center" jc="space-between">
              <Text fontSize={fs(16)} fontWeight="700" fontFamily="$baemin">
                정렬 및 필터
              </Text>
            </XStack>

            <YStack gap="$3">
              <Text fontSize={fs(14)} fontWeight="700" fontFamily="$heading">
                정렬 기준
              </Text>

              {SORT_OPTIONS.map((option) => {
                const isActive = draftSort === option.value;
                return (
                  <Button
                    key={option.value}
                    h={ms(52)}
                    bg="$surface"
                    boc="$gray3"
                    bw={1}
                    br="$6"
                    onPress={() => setDraftSort(option.value)}
                    pressStyle={{ scale: 0.98 }}
                  >
                    <XStack f={1} ai="center" jc="space-between" px="$1">
                      <Text
                        fontSize={fs(14)}
                        fontWeight="700"
                        color="$mainText"
                        fontFamily="$baemin"
                      >
                        {option.label}
                      </Text>

                      <View
                        w={s(30)}
                        h={s(30)}
                        br={999}
                        bw={s(3)}
                        boc={isActive ? "$primary" : "$gray3"}
                        ai="center"
                        jc="center"
                      >
                        {isActive && (
                          <View w={s(12)} h={s(12)} br={999} bg="$primary" />
                        )}
                      </View>
                    </XStack>
                  </Button>
                );
              })}
            </YStack>

            <YStack gap="$3">
              <Text fontSize={fs(14)} fontWeight="700" fontFamily="$heading">
                카테고리
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap="$2" pr="$4">
                  {categories.map((category) => {
                    const isActive = draftCategory === category;
                    return (
                      <Button
                        key={category}
                        backgroundColor={isActive ? "$primary" : "$gray3"}
                        br="$4"
                        px="$4"
                        size="$4"
                        onPress={() => setDraftCategory(category)}
                        pressStyle={{ scale: 0.97 }}
                        h={ms(40)}
                      >
                        <Text
                          fontFamily="$baemin"
                          fontSize={fs(13)}
                          fontWeight="700"
                          color="$mainText"
                        >
                          {category}
                        </Text>
                      </Button>
                    );
                  })}
                </XStack>
              </ScrollView>
            </YStack>

            <Button
              h={ms(52)}
              br="$6"
              bg="$primary"
              mt="$2"
              onPress={() => {
                onApply({
                  sort: draftSort,
                  category: draftCategory,
                });
                requestClose(true);
              }}
              pressStyle={{ scale: 0.98 }}
            >
              <Text fontSize={fs(15)} fontWeight="700" fontFamily="$baemin">
                적용하기
              </Text>
            </Button>
          </YStack>
        </Animated.View>
      </YStack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export type { SortOption };
