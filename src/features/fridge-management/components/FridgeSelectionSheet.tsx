import { Check, PlusCircle, Refrigerator } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
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
import { fs, getBottomPaddingForSheet, ms, s } from "@/shared/constants/layout";

export const FridgeSelectionSheet = ({
  visible,
  onClose,
  fridges,
  selectedId,
  onSelect,
}: FridgeSelectionProps) => {
  const insets = useSafeAreaInsets();

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
            <YStack
              key="fridge-selection-sheet"
              bg="$background"
              p="$5"
              pb={getBottomPaddingForSheet({ bottomInset: insets.bottom })}
              gap="$4"
              br="$6"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              zIndex={100}
              animation="quick"
              enterStyle={{ y: 300, opacity: 0 }}
              exitStyle={{ y: 300, opacity: 0 }}
              y={0}
              opacity={1}
              maxHeight="70%"
            >
              <View
                w={s(40)}
                h={s(5)}
                bg="$gray4"
                br="$4"
                alignSelf="center"
                mb="$2"
              />

              <Text fontSize="$6" fontWeight="700" fontFamily="$baemin" mb="$2">
                냉장고 선택
              </Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                <YStack gap="$3">
                  {fridges.map((fridge) => {
                    const isSelected = fridge.id === selectedId;
                    return (
                      <XStack
                        key={fridge.id}
                        p="$4"
                        br="$5"
                        borderWidth={1}
                        borderColor={isSelected ? "$primary" : "$gray2"}
                        backgroundColor="$gray2"
                        ai="center"
                        jc="space-between"
                        onPress={() => onSelect(fridge.id)}
                      >
                        <XStack gap="$3" ai="center">
                          <View p="$2" br="$2" backgroundColor="$gray2">
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
                          <Circle size={s(22)} bc="$primary">
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
                    bc="$background"
                    mt="$2"
                    pressStyle={{ opacity: 0.7 }}
                    opacity={0.6}
                    onPress={() => {
                      onClose();
                      router.push("/fridge-add");
                    }}
                  >
                    <PlusCircle size={s(18)} color="$mainText" />
                    <Text
                      color="$mainText"
                      fontWeight="600"
                      fontFamily="$baemin"
                      fontSize={fs(14)}
                    >
                      새 냉장고 추가
                    </Text>
                  </XStack>
                </YStack>
              </ScrollView>
            </YStack>
          )}
        </AnimatePresence>
      </YStack>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
