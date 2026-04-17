import React from "react";
import { Modal, Pressable, StyleSheet } from "react-native";
import { AnimatePresence, Button, Text, View, XStack, YStack } from "tamagui";
import { CategoryActionSheetProps } from "../../types";

export const CategoryActionSheet = ({
  visible,
  onClose,
  target,
  onEdit,
  onDelete,
}: CategoryActionSheetProps) => {
  const isDefaultType = Boolean(target?.isDefaultType);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <YStack f={1} jc="flex-end">
        <Pressable style={styles.backdrop} onPress={onClose} />

        <AnimatePresence>
          {visible && (
            <YStack
              key="category-action-sheet"
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
                    h={52}
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
                    h={52}
                    br="$4"
                    onPress={() => {
                      if (!target) return;
                      onEdit(target);
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
                    h={52}
                    br="$4"
                    onPress={() => {
                      if (!target) return;
                      onDelete(target);
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
                    h={52}
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
          )}
        </AnimatePresence>
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

