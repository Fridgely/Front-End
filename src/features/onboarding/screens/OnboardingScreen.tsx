import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { Moon } from "@tamagui/lucide-icons";
import { FlatList, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Circle, Text, XStack, YStack } from "tamagui";
import { OnboardingItem } from "../components/OnboardingItem";
import { SLIDES } from "../constants/slides";
import { useOnboarding } from "../hooks/useOnboarding";
import { fs, ms, s } from "@/shared/constants/layout";

export function OnboardingScreen() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = resolveTheme(theme, useColorScheme()) === "dark";
  const {
    index,
    listRef,
    handleNext,
    onScrollEnd,
    completeAndGoNext,
    isLastSlide,
  } = useOnboarding();

  const backgroundColor = isDark ? "#0B1110" : "#FFFFFF";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <YStack f={1}>
        <XStack px="$6" pt="$5" jc="flex-end">
          <Button unstyled onPress={toggleTheme}>
            <Moon size={s(22)} color={isDark ? "#FFFFFF" : "#0B1110"} />
          </Button>
        </XStack>

        <FlatList
          ref={listRef}
          data={SLIDES}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <OnboardingItem item={item} isDark={isDark} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
        />

        <YStack px="$6" pb="$6" gap="$4">
          <XStack ai="center" jc="center" gap="$2">
            {SLIDES.map((_, i) => (
              <Circle
                key={i}
                size={s(7)}
                bg={i === index ? "$primary" : "$gray10"}
                opacity={i === index ? 1 : 0.6}
              />
            ))}
          </XStack>

          <Button
            bc="$primary"
            color="$white"
            h={ms(48)}
            br="$4"
            fontWeight="800"
            onPress={isLastSlide ? completeAndGoNext : handleNext}
          >
            <Text fontFamily="$baemin" fontWeight="800" fontSize={fs(15)} color="$white">
              {isLastSlide ? "Fridgely 시작하기" : "다음"}
            </Text>
          </Button>

          <Button unstyled onPress={completeAndGoNext} alignSelf="center">
            <Text
              fontFamily="$baemin"
              color={isDark ? "#B6C2BF" : "#667085"}
              textDecorationLine="underline"
              fontSize={fs(13)}
            >
              건너뛰기
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
