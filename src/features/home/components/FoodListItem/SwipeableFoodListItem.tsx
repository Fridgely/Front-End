import { Trash2 } from "@tamagui/lucide-icons";
import { ComponentRef, useRef } from "react";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, Text, View, YStack } from "tamagui";
import { SwipeableFoodListItemProps } from "../../types";
import { FoodListItem } from "./FoodListItem";
import { fs, ms, s } from "@/shared/constants/layout";

export function SwipeableFoodListItem({
  item,
  onPress,
  onDelete,
  isDeleting = false,
}: SwipeableFoodListItemProps) {
  const swipeableRef = useRef<ComponentRef<typeof ReanimatedSwipeable>>(null);

  const renderRightActions = () => {
    return (
      <View width={ms(72)} mr="$4" mb="$4" jc="center">
        <Button
          f={1}
          bg="$warning"
          borderRadius="$4"
          disabled={isDeleting}
          onPress={() => {
            if (onDelete) {
              onDelete(item.id);
            }
            requestAnimationFrame(() => {
              swipeableRef.current?.close();
            });
          }}
          pressStyle={{ opacity: 0.7 }}
        >
          <YStack gap="$1" ai="center" jc="center">
            <Trash2 size={s(18)} color="$white" />
            <Text color="$white" fontSize={fs(11)} fontWeight="700">
              삭제
            </Text>
          </YStack>
        </Button>
      </View>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      leftThreshold={30}
      rightThreshold={10}
    >
      <FoodListItem item={item} onPress={onPress} />
    </ReanimatedSwipeable>
  );
}
