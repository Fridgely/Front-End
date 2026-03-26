import { Trash2 } from "@tamagui/lucide-icons";
import { ComponentRef, useRef } from "react";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, Text, View, YStack } from "tamagui";
import { SwipeableFoodListItemProps } from "../../types";
import { FoodListItem } from "./FoodListItem";

export function SwipeableFoodListItem({
  item,
  onPress,
  onDelete,
  isDeleting = false,
}: SwipeableFoodListItemProps) {
  const swipeableRef = useRef<ComponentRef<typeof ReanimatedSwipeable>>(null);

  const renderRightActions = () => {
    return (
      <View width={80} mr="$4" mb="$4" jc="center">
        <Button
          f={1}
          bg="$warning"
          borderRadius="$4"
          disabled={isDeleting}
          onPress={() => {
            swipeableRef.current?.close();
            if (onDelete) {
              onDelete(item.id);
            }
          }}
          pressStyle={{ opacity: 0.7 }}
        >
          <YStack gap="$1" ai="center" jc="center">
            <Trash2 size="$2" color="$white" />
            <Text color="$white" fontSize={11} fontWeight="700">
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
