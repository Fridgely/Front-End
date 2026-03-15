import React from "react";
import { ScrollView, Text, View, YStack } from "tamagui";
import { PICKER_ITEM_HEIGHT } from "../../constants";
import { PickerColumnProps } from "../../types";

export const PickerColumn = ({
  items,
  selected,
  onSelect,
  format = (v) => v,
  width = 80,
}: PickerColumnProps) => {
  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / PICKER_ITEM_HEIGHT);

    if (items[index] !== undefined && items[index] !== selected) {
      onSelect(items[index]);
    }
  };

  return (
    <YStack width={width} h={PICKER_ITEM_HEIGHT * 3} pos="relative">
      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={PICKER_ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: PICKER_ITEM_HEIGHT }}
      >
        <YStack ai="center">
          {items.map((item) => {
            const isSelected = selected === item;
            return (
              <View key={item} h={PICKER_ITEM_HEIGHT} jc="center" ai="center">
                <Text
                  fontSize={isSelected ? "$5" : "$4"}
                  fontWeight={isSelected ? "700" : "400"}
                  color={isSelected ? "$primary" : "$gray8"}
                  opacity={isSelected ? 1 : 0.4}
                  animation="quick"
                >
                  {format(item)}
                </Text>
              </View>
            );
          })}
        </YStack>
      </ScrollView>
    </YStack>
  );
};
