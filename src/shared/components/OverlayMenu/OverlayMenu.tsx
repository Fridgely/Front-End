import {
  ChefHat,
  Refrigerator,
  ShoppingBasket,
  Tag,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View } from "tamagui";
import { MenuIcon } from "./MenuIcon";

export function OverlayMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  // 0 애니메이션 시작 전, 1 애니메이션 완료
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [isOpen]);

  // progress가 0일 때만 숨겨서 닫기 애니메이션 공간 확보
  const containerStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    display: progress.value === 0 ? "none" : "flex",
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.6,
  }));

  const menuGroupStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - progress.value) * 120 },
      { scale: progress.value },
    ],
  }));

  const MENU_ITEMS = [
    {
      angle: 175,
      distance: 110,
      icon: <ChefHat />,
      label: "AI 레시피",
      path: "/recipe",
      isDisabled: true,
    },
    {
      angle: 120,
      distance: 75,
      icon: <Tag />,
      label: "최저가찾기",
      path: "/price-check",
      isDisabled: true,
    },
    {
      angle: 60,
      distance: 75,
      icon: <ShoppingBasket />,
      label: "식품 등록",
      path: "/food-add",
      isDisabled: false,
    },
    {
      angle: 5,
      distance: 110,
      icon: <Refrigerator />,
      label: "냉장고관리",
      path: "/fridge",
      isDisabled: false,
    },
  ];

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, containerStyle, { zIndex: 1000 }]}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>

      <View f={1} jc="flex-end" ai="center" pointerEvents="box-none">
        <Animated.View style={[menuGroupStyle, styles.menuContainer]}>
          {MENU_ITEMS.map((item, index) => (
            <MenuIcon
              key={index}
              angle={item.angle}
              distance={item.distance}
              icon={item.icon}
              label={item.label}
              onPress={() => {
                onClose();
                router.push(item.path as any);
              }}
              isDisabled={item.isDisabled}
            />
          ))}
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  menuContainer: {
    width: "100%",
    height: 400,
    pointerEvents: "box-none",
  },
});
