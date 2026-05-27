import { useNotificationStore } from "@/features/notification/stores/useNotificationStore";
import { fs, getTopPaddingForHeader, ms, s } from "@/shared/constants/layout";
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
  onBackPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const hasUnreadNotifications = useNotificationStore((state) =>
    state.notifications.some((notification) => !notification.isRead),
  );

  return (
    <View
      backgroundColor="$background"
      style={{ paddingTop: getTopPaddingForHeader({ topInset: insets.top }) }}
    >
      <XStack
        height={ms(56)}
        paddingHorizontal="$4"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <XStack
          position="absolute"
          left="$4"
          right="$14"
          alignItems="center"
          justifyContent="flex-start"
        >
          {showBackButton ? (
            <Button
              size="$2"
              chromeless
              icon={<ChevronLeft size={s(22)} color="$mainText" />}
              onPress={() =>
                onBackPress ? onBackPress() : router.back()
              }
              paddingLeft={0}
            />
          ) : (
            <Heading
              size="$6"
              fontWeight="700"
              color="$mainText"
              letterSpacing={-0.5}
              fontSize={fs(18)}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1, width: "100%" }}
            >
              {title}
            </Heading>
          )}
        </XStack>

        {showBackButton && (
          <Heading
            size="$5"
            fontWeight="700"
            color="$mainText"
            fontSize={fs(18)}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ maxWidth: "70%" }}
          >
            {title}
          </Heading>
        )}

        <XStack position="absolute" right="$4">
          {showNotificationBell && (
            <Button
              size="$4"
              circular
              chromeless
              icon={
                <View position="relative">
                  <Bell size={s(22)} color="$mainText" />
                  {hasUnreadNotifications && (
                    <View
                      position="absolute"
                      top={-s(2)}
                      right={-s(2)}
                      width={s(8)}
                      height={s(8)}
                      borderRadius={100}
                      backgroundColor="$warning"
                    />
                  )}
                </View>
              }
              pressStyle={{ opacity: 0.5 }}
              onPress={() => router.push("/notification")}
            />
          )}
        </XStack>
      </XStack>
    </View>
  );
}
