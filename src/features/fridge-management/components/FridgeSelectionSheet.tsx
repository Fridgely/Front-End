import { fs, getBottomPaddingForSheet, s } from "@/shared/constants/layout";
import { Check, PlusCircle, Refrigerator } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AnimatePresence,
  Circle,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { FridgeSelectionProps } from "../types";

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const FridgeSelectionSheet = ({
  visible,
  onClose,
  fridges,
  selectedId,
  onSelect,
}: FridgeSelectionProps) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.5) {
          onClose();
          setTimeout(() => translateY.setValue(0), 200);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <YStack f={1} jc="flex-end">
        <AnimatePresence>
          {visible && (
            <Pressable style={styles.backdrop} onPress={onClose}>
              <View
                f={1}
                animation="quick"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                bg="rgba(0,0,0,0.5)"
              />
            </Pressable>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {visible && (
            <AnimatedYStack
              key="fridge-selection-sheet"
              bg="$background"
              pb={getBottomPaddingForSheet({ bottomInset: insets.bottom })}
              br="$6"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              zIndex={100}
              animation="quick"
              enterStyle={{ y: 300, opacity: 0 }}
              exitStyle={{ y: 300, opacity: 0 }}
              style={{
                transform: [{ translateY }],
              }}
              maxHeight="75%"
            >
              <YStack {...panResponder.panHandlers} py="$3" ai="center">
                <View w={s(40)} h={s(5)} bg="$gray4" br="$4" />
              </YStack>

              <Text
                px="$5"
                pb="$3"
                fontSize="$6"
                fontWeight="700"
                fontFamily="$baemin"
              >
                냉장고 선택
              </Text>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: s(20),
                  paddingBottom: s(10),
                }}
              >
                <YStack gap="$3">
                  {fridges.map((fridge) => {
                    const isSelected = fridge.id === selectedId;
                    return (
                      <XStack
                        key={fridge.id}
                        p="$4"
                        br="$5"
                        bw={1}
                        bc={isSelected ? "$primary" : "$gray2"}
                        bg="$gray2"
                        ai="center"
                        jc="space-between"
                        onPress={() => onSelect(fridge.id)}
                      >
                        <XStack gap="$3" ai="center">
                          <View p="$2" br="$2" bg="$gray2">
                            <Refrigerator
                              size={s(24)}
                              color={isSelected ? "$primary" : "$gray10"}
                            />
                          </View>
                          <YStack>
                            <Text
                              fontWeight="700"
                              fontSize={fs(14)}
                              fontFamily="$baemin"
                            >
                              {fridge.name}
                            </Text>
                            <Text
                              fontSize={fs(12)}
                              color="$primary"
                              fontWeight="600"
                            >
                              {fridge.role}
                            </Text>
                          </YStack>
                        </XStack>

                        {isSelected && (
                          <Circle size={s(22)} bc="$primary" bg="$primary">
                            <Check size={s(14)} color="$white" />
                          </Circle>
                        )}
                      </XStack>
                    );
                  })}

                  <XStack
                    ai="center"
                    jc="center"
                    gap="$2"
                    py="$4"
                    br="$5"
                    borderStyle="dashed"
                    borderWidth={1}
                    bc="$white"
                    mt="$2"
                    onPress={() => {
                      onClose();
                      router.push("/fridge-add");
                    }}
                  >
                    <PlusCircle size={s(18)} color="$gray10" />
                    <Text
                      color="$gray10"
                      fontWeight="600"
                      fontFamily="$baemin"
                      fontSize={fs(14)}
                    >
                      새 냉장고 추가
                    </Text>
                  </XStack>
                </YStack>
              </ScrollView>
            </AnimatedYStack>
          )}
        </AnimatePresence>
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },
});
