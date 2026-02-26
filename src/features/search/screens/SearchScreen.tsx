import { FlashList } from "@shopify/flash-list";
import { Search as SearchIcon, X } from "@tamagui/lucide-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Text, View, XStack, YStack } from "tamagui";
import { SearchResultItem } from "../components/SearchResultItem";
import { useSearchFood } from "../hooks/useSearchFood";

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { filteredResult } = useSearchFood(searchQuery);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8F7" }}>
      <YStack f={1} backgroundColor="$background">
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
            renderItem={({ item }) => <SearchResultItem item={item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
              <View backgroundColor="$gray3" mx="$4" height={1} />
            )}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
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
