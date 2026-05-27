import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

import { Text, View, YStack } from "tamagui";

import { PICKER_ITEM_HEIGHT } from "../../constants";
import { PickerColumnProps } from "../../types";

const LIST_VIRTUALIZE_THRESHOLD = 24;

const contentPadding = { paddingVertical: PICKER_ITEM_HEIGHT };

const getItemLayout = (_: unknown, index: number) => ({
  length: PICKER_ITEM_HEIGHT,
  offset: PICKER_ITEM_HEIGHT + index * PICKER_ITEM_HEIGHT,
  index,
});

type RowProps = {
  item: string | number;
  selected: string | number;
  format: (value: string | number) => string | number;
};

const PickerRow = memo(function PickerRow({
  item,
  selected,
  format,
}: RowProps) {
  const isSelected = selected === item;
  return (
    <View h={PICKER_ITEM_HEIGHT} jc="center" ai="center">
      <Text
        fontSize={isSelected ? "$5" : "$4"}
        fontWeight={isSelected ? "700" : "400"}
        color={isSelected ? "$primary" : "$gray8"}
        opacity={isSelected ? 1 : 0.4}
      >
        {format(item)}
      </Text>
    </View>
  );
});

function PickerColumnInner({
  items,
  selected,
  onSelect,
  format = (v) => v,
  width = 80,
}: PickerColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const listRef = useRef<FlatList<string | number>>(null);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const index = Math.round(y / PICKER_ITEM_HEIGHT);

      if (items[index] !== undefined && items[index] !== selected) {
        onSelect(items[index]);
      }
    },
    [items, onSelect, selected],
  );

  const selectedIndex = useMemo(() => {
    const i = items.indexOf(selected);
    return i >= 0 ? i : 0;
  }, [items, selected]);

  useLayoutEffect(() => {
    const y = selectedIndex * PICKER_ITEM_HEIGHT;
    if (items.length > LIST_VIRTUALIZE_THRESHOLD) {
      listRef.current?.scrollToOffset({ offset: y, animated: false });
    } else {
      scrollRef.current?.scrollTo({ y, animated: false });
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: string | number }) => (
      <PickerRow item={item} selected={selected} format={format} />
    ),
    [format, selected],
  );

  const keyExtractor = useCallback((item: string | number) => String(item), []);

  if (items.length > LIST_VIRTUALIZE_THRESHOLD) {
    return (
      <YStack width={width} h={PICKER_ITEM_HEIGHT * 3} pos="relative">
        <FlatList
          ref={listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          snapToInterval={PICKER_ITEM_HEIGHT}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={contentPadding}
          getItemLayout={getItemLayout}
          removeClippedSubviews
          windowSize={7}
          maxToRenderPerBatch={12}
          initialNumToRender={14}
        />
      </YStack>
    );
  }

  return (
    <YStack width={width} h={PICKER_ITEM_HEIGHT * 3} pos="relative">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={PICKER_ITEM_HEIGHT}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentPadding}
      >
        <YStack ai="center">
          {items.map((item) => (
            <PickerRow
              key={String(item)}
              item={item}
              selected={selected}
              format={format}
            />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

export const PickerColumn = memo(PickerColumnInner);
