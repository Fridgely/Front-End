import { Bell, Clock, Info, Users } from "@tamagui/lucide-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { BackHandler } from "react-native";
import Toast from "react-native-toast-message";
import {
  Button,
  ScrollView,
  Spinner,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { Header } from "@/shared/components/Header/Header";
import { openNotificationSettings } from "@/shared/utils/openNotificationSettings";

import { DayButton } from "../components/DayButton";
import { SettingRow } from "../components/SettingRow";
import { TimePickerSelect } from "../components/TimePicker/TimePickerSelect";
import { useNotificationSettings } from "../hooks/useNotificationSettings";

export function NotificationSettingScreen() {
  const router = useRouter();
  const {
    data: settings,
    isLoading,
    updateSettings,
    isUpdating,
  } = useNotificationSettings();

  const goBackToProfile = useCallback(() => {
    router.replace("/profile");
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        goBackToProfile();
        return true;
      });
      return () => sub.remove();
    }, [goBackToProfile]),
  );

  const handleOpenNotificationSettings = useCallback(async () => {
    try {
      await openNotificationSettings();
    } catch {
      Toast.show({
        type: "error",
        text1: "이동 실패",
        text2: "시스템 설정을 열 수 없습니다.",
      });
    }
  }, []);

  const bellIcon = useMemo(
    () => <Bell size="$3" color="$primary" />,
    [],
  );
  const usersIcon = useMemo(
    () => <Users size="$3" color="$primary" />,
    [],
  );

  const handleEnabledChange = useCallback(
    (enabled: boolean) => updateSettings({ enabled }),
    [updateSettings],
  );
  const handleDayPress = useCallback(
    (day: number) => updateSettings({ daysBeforeExpiration: day }),
    [updateSettings],
  );
  const handleTimeChange = useCallback(
    (time: string) => updateSettings({ notificationTime: time }),
    [updateSettings],
  );

  if (isLoading || !settings) {
    return (
      <YStack f={1} backgroundColor="$background">
        <Header
          title="알림"
          showBackButton
          showNotificationBell={false}
          onBackPress={goBackToProfile}
        />
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack f={1} backgroundColor="$background">
      <Header
        title="알림 설정"
        showBackButton
        showNotificationBell={false}
        onBackPress={goBackToProfile}
      />

      <ScrollView f={1}>
        <YStack gap="$5">
          <Section label="식재료 관리 알림">
            <SettingRow
              icon={bellIcon}
              title="유통기한 임박 알림"
              description="식재료의 신선도를 유지하세요"
              checked={settings.enabled}
              onCheckedChange={handleEnabledChange}
              disabled={isUpdating}
            />

            <YStack
              gap="$2"
              pl="$1"
              opacity={settings.enabled ? 1 : 0.4}
              pointerEvents={settings.enabled ? "auto" : "none"}
            >
              <Text
                fontSize="$3"
                color={settings.enabled ? "$gray10" : "$gray8"}
              >
                알림 시점 선택
              </Text>
              <XStack gap="$3">
                {[1, 3, 7].map((day) => (
                  <DayButton
                    key={day}
                    day={day}
                    active={
                      settings.enabled && settings.daysBeforeExpiration === day
                    }
                    onPress={() => handleDayPress(day)}
                    disabled={isUpdating}
                  />
                ))}
              </XStack>
            </YStack>
          </Section>

          <Section label="공유 및 활동">
            <SettingRow
              icon={usersIcon}
              title="새로운 냉장고 멤버 참여"
              description="초대한 멤버가 수락하면 알려드려요"
              checked={true} //  현재는 고정값
              disabled
            />
          </Section>

          <Section label="시스템 설정">
            <XStack
              jc="space-between"
              ai="center"
              py="$2"
              opacity={settings.enabled ? 1 : 0.4}
              pointerEvents={settings.enabled ? "auto" : "none"}
            >
              <XStack gap="$3" ai="center">
                <View backgroundColor="$gray2" p="$2" br="$2">
                  <Clock
                    size={22}
                    color={settings.enabled ? "$mainText" : "$gray8"}
                  />
                </View>
                <Text
                  fontSize="$4"
                  fontWeight="bold"
                  color={settings.enabled ? "$mainText" : "$gray8"}
                >
                  알림 시간 설정
                </Text>
              </XStack>

              <TimePickerSelect
                value={settings.notificationTime}
                onValueChange={handleTimeChange}
                disabled={isUpdating}
              />
            </XStack>
          </Section>

          <YStack px="$4" pb="$5">
            <XStack
              backgroundColor="$iconBackground"
              borderColor="$primary"
              borderWidth={1}
              p="$4"
              br="$3"
              gap="$3"
            >
              <View mt="$1">
                <Info size="$1.5" color="$primary" />
              </View>
              <YStack f={1} gap="$2" ai="flex-start">
                <Text fontSize="$3" color="$mainText" lineHeight={20}>
                  기기 자체의 알림 설정이 꺼져있는 경우, Fridgely 앱의 알림을
                  정상적으로 받을 수 없습니다.
                </Text>
                <Button
                  p={0}
                  h="auto"
                  chromeless
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => void handleOpenNotificationSettings()}
                >
                  <Text
                    fontSize="$3"
                    color="$primary"
                    fontWeight="bold"
                    textDecorationLine="underline"
                  >
                    시스템 설정으로 이동
                  </Text>
                </Button>
              </YStack>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

/**
 * 화면 내부에서 공통으로 사용하는 섹션
 */
const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <YStack gap="$3">
    <YStack backgroundColor="$gray3" px="$4" py="$2">
      <Text
        fontFamily="$baemin"
        fontSize="$4"
        fontWeight="700"
        color="$mainText"
      >
        {label}
      </Text>
    </YStack>
    <YStack px="$4" gap="$4">
      {children}
    </YStack>
  </YStack>
);
