import { Bell, ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Heading, View, XStack } from "tamagui";
import { HeaderProps } from "./Header.types";
export function Header({
  title = "Fridgely",
  showBackButton = false,
  showNotificationBell = false,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View backgroundColor="$background" style={{ paddingTop: insets.top }}>
      <XStack
        height={60}
        paddingHorizontal="$4"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <XStack position="absolute" left="$4" alignItems="center">
          {showBackButton ? (
            <Button
              size="$2"
              chromeless
              icon={<ChevronLeft size={24} color="$mainText" />}
              onPress={() => router.back()}
              paddingLeft={0}
            />
          ) : (
            <Heading
              size="$6"
              fontWeight="700"
              color="$mainText"
              letterSpacing={-0.5}
            >
              {title}
            </Heading>
          )}
        </XStack>

        {showBackButton && (
          <Heading size="$5" fontWeight="700" color="$mainText">
            {title}
          </Heading>
        )}

        <XStack position="absolute" right="$4">
          {showNotificationBell && (
            <Button
              size="$4"
              circular
              chromeless
              icon={<Bell size={24} color="$mainText" />}
              pressStyle={{ opacity: 0.5 }}
              onPress={() => router.push("/notification")}
            />
          )}
        </XStack>
      </XStack>
    </View>
  );
}
