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
import { Button, Input, Text, View, YStack } from "tamagui";
import { FridgeNameEditSheetProps } from "../types";

export const FridgeNameEditSheet = ({
  visible,
  onClose,
  currentName,
  onSave,
  isLoading,
}: FridgeNameEditSheetProps) => {
  const [newName, setNewName] = useState(currentName);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const nameInputRef = useRef<TextInput | null>(null);

  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  const [show, setShow] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
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

  useEffect(() => {
    if (visible) {
      setNewName(currentName);
    }
  }, [visible, currentName]);

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
  }, [
    backdropOpacity,
    runClose,
    sheetHiddenY,
    sheetOpacity,
    translateY,
    visible,
  ]);

  useEffect(() => {
    if (!visible || !show) return;
    const task = InteractionManager.runAfterInteractions(() => {
      nameInputRef.current?.focus();
    });
    return () => task.cancel();
  }, [visible, show]);

  const handleSave = () => {
    if (newName.trim() && newName !== currentName) {
      onSave(newName.trim());
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
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : isKeyboardVisible
              ? "height"
              : undefined
        }
        style={styles.flex}
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
            {...panResponder.panHandlers}
          >
            <YStack
              bg="$background"
              p="$5"
              pb={getBottomPaddingForSheet({ bottomInset: insets.bottom })}
              gap="$5"
              br="$6"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              zIndex={100}
            >
              <View w={s(40)} h={s(5)} bg="$gray4" br="$4" alignSelf="center" />

              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="700" fontFamily="$baemin">
                  냉장고 이름 수정
                </Text>
                <Text fontSize="$3" color="$gray10">
                  변경할 냉장고 이름을 입력해주세요.
                </Text>
              </YStack>

              <YStack gap="$4">
                <Input
                  ref={nameInputRef}
                  size="$5"
                  bw={1}
                  bc={newName !== currentName ? "$primary" : "$gray4"}
                  value={newName}
                  onChangeText={setNewName}
                  maxLength={15}
                  fontSize="$2"
                  fontFamily="$baemin"
                  backgroundColor="$gray3"
                />

                <Button
                  bc="$primary"
                  disabled={
                    !newName.trim() || newName === currentName || isLoading
                  }
                  onPress={handleSave}
                  h={ms(48)}
                  br="$4"
                >
                  <Text
                    color="$mainText"
                    fontWeight="700"
                    fontSize={fs(15)}
                    fontFamily="$baemin"
                  >
                    {isLoading ? "수정 중..." : "수정 완료"}
                  </Text>
                </Button>
              </YStack>
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
