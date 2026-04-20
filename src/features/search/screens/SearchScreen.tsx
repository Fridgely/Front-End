import { useSelectedFridgeId } from "@/shared/stores/useFridgeStore";
import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { FlashList } from "@shopify/flash-list";
import { Search as SearchIcon, X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useColorScheme } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack, useTheme } from "tamagui";
import { SearchResultItem } from "../components/SearchResultItem";
import { useSearchFood } from "../hooks/useSearchFood";

export function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const selectedFridgeId = useSelectedFridgeId();
  const themeTokens = useTheme();
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark = resolveTheme(theme, systemColorScheme) === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredResult } = useSearchFood(searchQuery);
  const backgroundColor = themeTokens.background.get();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <YStack f={1} backgroundColor={backgroundColor}>
        <XStack px="$3" py="$2" ai="center" gap="$2">
          <XStack
            f={1}
            backgroundColor="$gray3"
            br="$4"
            ai="center"
            px="$3"
            height={44}
            ov="hidden"
          >
            <SearchIcon size={16} color="$gray10" />
            <Input
              f={1}
              borderWidth={0}
              backgroundColor="transparent"
              placeholder="식재료 이름을 검색해보세요"
              placeholderTextColor={isDark ? "$gray10" : "$gray5"}
              value={searchQuery}
              onChangeText={setSearchQuery}
              focusStyle={{ borderWidth: 0 }}
              fontFamily="$baemin"
              fontSize={14}
              height="100%"
              p={0}
              pl="$2"
            />
            {searchQuery.length > 0 ? (
              <Button
                size="$2"
                circular
                chromeless
                icon={<X size={14} color="$gray10" />}
                onPress={() => setSearchQuery("")}
              />
            ) : null}
          </XStack>

          <View onPress={() => setSearchQuery("")} py="$2" px="$1">
            <Text color="$gray10" fontSize={15} fontFamily="$baemin">
              취소
            </Text>
          </View>
        </XStack>

        <View f={1} width="100%">
          <FlashList
            data={filteredResult}
            renderItem={({ item }) => (
              <SearchResultItem
                item={item}
                onPress={() => {
                  const targetRefrigeratorId =
                    item.refrigeratorId ?? selectedFridgeId ?? undefined;

                  router.push({
                    pathname: "/food/[id]",
                    params: {
                      id: item.id.toString(),
                      ...(targetRefrigeratorId !== undefined
                        ? { refrigeratorId: targetRefrigeratorId.toString() }
                        : {}),
                    },
                  } as any);
                }}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
              <View backgroundColor="$gray3" mx="$4" height={1} />
            )}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 24,
            }}
            style={{ backgroundColor }}
            ListEmptyComponent={
              searchQuery ? (
                <YStack f={1} ai="center" jc="center" mt="$10">
                  <Text color="$gray9">검색 결과가 없습니다.</Text>
                </YStack>
              ) : null
            }
          />
        </View>
      </YStack>
    </SafeAreaView>
  );
}
