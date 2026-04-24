import { UNIT_OPTIONS } from "@/shared/constants/food";
import { fs, getBottomPaddingForSheet, ms, s } from "@/shared/constants/layout";
import { ChevronDown } from "@tamagui/lucide-icons";
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
import {
  Button,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

export const UnitSelector = ({ value, onChange }: any) => {
  const [show, setShow] = useState(false);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const translateY = useRef(new Animated.Value(0)).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isAnimatingRef = useRef(false);

  const sheetHiddenY = useMemo(
    () => Math.max(50, Math.round(windowHeight * 0.25)),
    [windowHeight],
  );

  const currentLabel = useMemo(
    () => UNIT_OPTIONS.find((opt) => opt.value === value)?.label || value,
    [value],
  );

  const open = useCallback(() => {
    if (isAnimatingRef.current) return;
    setShow(true);
  }, []);

  const close = useCallback(() => {
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
    if (!show) return;
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
  }, [backdropOpacity, sheetHiddenY, sheetOpacity, show, translateY]);

  return (
    <>
      <Button
        h={ms(44)}
        minWidth={ms(76)}
        bg="$gray3"
        br="$4"
        onPress={open}
        iconAfter={<ChevronDown size={s(13)} color="$gray9" />}
      >
        <Text fontSize={fs(13)} color="$mainText" fontFamily="$baemin">
          {value.label || currentLabel}
        </Text>
      </Button>

      <Modal
        visible={show}
        transparent
        animationType="none"
        onRequestClose={close}
        hardwareAccelerated
        statusBarTranslucent
      >
        <YStack f={1} jc="flex-end">
          <Pressable style={StyleSheet.absoluteFill} onPress={close}>
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
                단위 선택
              </Text>

              <XStack flexWrap="wrap" gap="$2">
                {UNIT_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      close();
                    }}
                    bg={value === option.value ? "$primary" : "$gray3"}
                    br="$4"
                    px="$4"
                    h={ms(44)}
                    pressStyle={{ scale: 0.95 }}
                  >
                    <Text
                      color="$mainText"
                      fontWeight="700"
                      fontSize={fs(13)}
                    >
                      {option.label}
                    </Text>
                  </Button>
                ))}
              </XStack>
            </YStack>
          </Animated.View>
        </YStack>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // 기존과 동일한 딤(배경)
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
