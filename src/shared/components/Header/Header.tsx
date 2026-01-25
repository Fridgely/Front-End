import { Bell, ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, H2, View, XStack } from "tamagui";
import { HeaderProps } from "./Header.types";

export function Header({
  title = "Fridgely",
  showBackButton = false,
  showNotificationBell = true,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View backgroundColor="$background" style={{ paddingTop: insets.top }}>
      <XStack
        height={60}
        paddingHorizontal="$4"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" gap="$2">
          {showBackButton && (
            <Button
              size="$2"
              chromeless // 배경 투명 및 테두리 제거
              icon={<ChevronLeft size={24} color="$primary" />}
              onPress={() => router.back()}
              paddingLeft={0}
            />
          )}
          <H2
            fontSize="$6"
            fontWeight="900"
            color="$primary"
            letterSpacing={-0.5}
          >
            {title}
          </H2>
        </XStack>

        {showNotificationBell && (
          <Button
            size="$4"
            circular
            chromeless
            icon={<Bell size={24} color="$primary" />}
            pressStyle={{ opacity: 0.5 }}
            onPress={() => {
              router.push("/notification");
            }}
          />
        )}
      </XStack>
    </View>
  );
}
