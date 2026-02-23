import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet } from "react-native";
import { AnimatePresence, Button, Text, View, XStack, YStack } from "tamagui";
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

  useEffect(() => {
    if (!visible) return;
    setDraftSort(selectedSort);
    setDraftCategory(selectedCategory);
  }, [visible, selectedSort, selectedCategory]);

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
              key="sort-filter-sheet"
              bg="$background"
              p="$5"
              pb="$6"
              gap="$5"
              br="$6"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              animation="quick"
              enterStyle={{ y: 80, opacity: 0 }}
              exitStyle={{ y: 80, opacity: 0 }}
              y={0}
              opacity={1}
            >
              <View w={56} h={6} bg="$gray4" br="$4" alignSelf="center" />

              <XStack ai="center" jc="space-between">
                <Text fontSize="$5" fontWeight="700" fontFamily="$baemin">
                  정렬 및 필터
                </Text>
              </XStack>

              <YStack gap="$3">
                <Text fontSize="$4" fontWeight="700" fontFamily="$heading">
                  정렬 기준
                </Text>

                {SORT_OPTIONS.map((option) => {
                  const isActive = draftSort === option.value;
                  return (
                    <Button
                      key={option.value}
                      h={62}
                      bg="$white"
                      boc="$gray3"
                      bw={1}
                      br="$6"
                      onPress={() => setDraftSort(option.value)}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <XStack f={1} ai="center" jc="space-between" px="$1">
                        <Text
                          fontSize="$4"
                          fontWeight="700"
                          color="$mainText"
                          fontFamily="$baemin"
                        >
                          {option.label}
                        </Text>

                        <View
                          w={34}
                          h={34}
                          br={999}
                          bw={4}
                          boc={isActive ? "$primary" : "$gray3"}
                          ai="center"
                          jc="center"
                        >
                          {isActive && (
                            <View w={14} h={14} br={999} bg="$primary" />
                          )}
                        </View>
                      </XStack>
                    </Button>
                  );
                })}
              </YStack>

              <YStack gap="$3">
                <Text fontSize="$4" fontWeight="700" fontFamily="$heading">
                  카테고리
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2" pr="$4">
                    {categories.map((category) => {
                      const isActive = draftCategory === category;
                      return (
                        <Button
                          key={category}
                          backgroundColor={isActive ? "$primary" : "$white"}
                          boc="$gray3"
                          bw={1}
                          br="$6"
                          px="$4"
                          h={48}
                          onPress={() => setDraftCategory(category)}
                          pressStyle={{ scale: 0.97 }}
                        >
                          <Text
                            fontFamily="$baemin"
                            fontSize="$3"
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
                h={64}
                br="$6"
                bg="$primary"
                mt="$2"
                onPress={() => {
                  onApply({
                    sort: draftSort,
                    category: draftCategory,
                  });
                  onClose();
                }}
                pressStyle={{ scale: 0.98 }}
              >
                <Text fontSize="$5" fontWeight="700" fontFamily="$baemin">
                  적용하기
                </Text>
              </Button>
            </YStack>
          )}
        </AnimatePresence>
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
