import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function AnimatedSplashScreen({
  onAnimationFinish,
}: {
  onAnimationFinish: () => void;
}) {
  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withDelay(
      500,
      withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      }),
    );

    const timer = setTimeout(() => {
      onAnimationFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Image
          source={require("../assets/images/closed_fridge.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animated.View
        style={[StyleSheet.absoluteFill, styles.centered, animatedStyle]}
      >
        <Image
          source={require("../assets/images/open_fridge.png")}
          style={[
            styles.logo,
            { transform: [{ translateX: -2 }, { translateY: 1.3 }] },
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F6EA",
    justifyContent: "center",
    alignItems: "center",
  },
  centered: { justifyContent: "center", alignItems: "center" },
  logo: { width: width * 0.8, height: width * 0.8 },
});
