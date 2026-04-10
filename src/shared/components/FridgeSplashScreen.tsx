import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

const CLOSED_IMAGE = require("../assets/images/closed_fridge.png");
const OPEN_IMAGE = require("../assets/images/open_fridge.png");
const NATIVE_ICON_IMAGE = require("../../../assets/images/splash-screen.png");
const NATIVE_ICON_CIRCLE_SIZE = 160;
const SPLASH_IMAGE_SIZE = 240;

const OPEN_START_DELAY = 600;
const OPEN_DURATION = 600;
const FINISH_HOLD = 300;

export default function FridgeSplashScreen({
  onAnimationFinish,
}: {
  onAnimationFinish: () => void;
}) {
  const nativeLikeOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const openOpacity = useRef(new Animated.Value(0)).current;
  // 화면 전환 타이머 (언마운트시 정리)
  const finishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // StrictMode/리렌더 상황에서 onAnimationFinish 중복 호출 방지
  const finishedRef = useRef(false);

  useEffect(() => {
    // 첫 렌더에서 이미지 캐시를 예열해서 지연 로드를 줄임
    const closedUri = Image.resolveAssetSource(CLOSED_IMAGE).uri;
    const openUri = Image.resolveAssetSource(OPEN_IMAGE).uri;
    const nativeIconUri = Image.resolveAssetSource(NATIVE_ICON_IMAGE).uri;
    void Image.prefetch(closedUri);
    void Image.prefetch(openUri);
    void Image.prefetch(nativeIconUri);

    // 첫 프레임은 네이티브 스플래시와 최대한 동일하게 보여주고,
    // 아주 짧게 유지한 후 애니메이션으로 넘어간다.
    const firstFrameTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(nativeLikeOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);

    const delayTimer = setTimeout(() => {
      Animated.timing(openOpacity, {
        toValue: 1,
        duration: OPEN_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || finishedRef.current) return;

        finishTimerRef.current = setTimeout(() => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onAnimationFinish();
        }, FINISH_HOLD);
      });
    }, OPEN_START_DELAY);

    return () => {
      // 컴포넌트 종료 시 타이머,애니메이션 정리
      clearTimeout(firstFrameTimer);
      clearTimeout(delayTimer);
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
        finishTimerRef.current = null;
      }
      openOpacity.stopAnimation();
    };
  }, [logoOpacity, nativeLikeOpacity, onAnimationFinish, openOpacity]);

  return (
    <View style={styles.container}>
      {/* 네이티브 스플래시와 동일한 첫 프레임 */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.centered,
          { opacity: nativeLikeOpacity },
        ]}
      >
        <View style={styles.nativeIconCircle}>
          <Image
            source={NATIVE_ICON_IMAGE}
            style={styles.nativeIconImage}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      {/* 커스텀 스플래시 로고 레이어 */}
      <Animated.View style={[styles.centered, { opacity: logoOpacity }]}>
        <Image source={CLOSED_IMAGE} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.centered,
          { opacity: openOpacity },
        ]}
      >
        <Image
          source={OPEN_IMAGE}
          style={[styles.logo, styles.openOffset]}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  nativeIconCircle: {
    width: NATIVE_ICON_CIRCLE_SIZE,
    height: NATIVE_ICON_CIRCLE_SIZE,
    borderRadius: NATIVE_ICON_CIRCLE_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#E0F6EA",
  },
  nativeIconImage: {
    width: "100%",
    height: "100%",
  },
  logo: {
    width: SPLASH_IMAGE_SIZE,
    height: SPLASH_IMAGE_SIZE,
  },
  openOffset: {
    transform: [{ translateX: -2 }, { translateY: 1.3 }],
  },
});
