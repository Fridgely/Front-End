import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { AnimatePresence, Button, Input, Text, View, YStack } from "tamagui";
import { FridgeNameEditSheetProps } from "../types";

export const FridgeNameEditSheet = ({
  visible,
  onClose,
  currentName,
  onSave,
  isLoading,
}: FridgeNameEditSheetProps) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    if (visible) {
      setNewName(currentName);
    }
  }, [visible, currentName]);

  const handleSave = () => {
    if (newName.trim() && newName !== currentName) {
      onSave(newName.trim());
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
                key="fridge-name-edit-sheet"
                bg="$background"
                p="$5"
                pb={Platform.OS === "ios" ? "$10" : "$5"}
                gap="$5"
                br="$6"
                borderBottomLeftRadius={0}
                borderBottomRightRadius={0}
                zIndex={100}
                animation="quick"
                enterStyle={{ y: 300, opacity: 0 }}
                exitStyle={{ y: 300, opacity: 0 }}
                y={0}
                opacity={1}
              >
                <View w={40} h={5} bg="$gray4" br="$4" alignSelf="center" />

                <YStack gap="$2">
                  <Text fontSize="$6" fontWeight="700" fontFamily="$baemin">
                    냉장고 이름 수정
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    변경할 냉장고 이름을 입력해주세요.
                  </Text>
                </YStack>

                <YStack gap="$4">
                  <Input
                    size="$5"
                    bw={1}
                    bc={newName !== currentName ? "$primary" : "$gray4"}
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                    maxLength={15}
                    fontSize="$3"
                    backgroundColor="$gray3"
                  />

                  <Button
                    bc="$primary"
                    disabled={
                      !newName.trim() || newName === currentName || isLoading
                    }
                    onPress={handleSave}
                    h={56}
                    br="$4"
                  >
                    <Text color="$black" fontWeight="700" fontSize={16}>
                      {isLoading ? "수정 중..." : "수정 완료"}
                    </Text>
                  </Button>
                </YStack>
              </YStack>
            )}
          </AnimatePresence>
        </YStack>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
