import { Header } from "@/shared/components/Header/Header";
import {
  Bell,
  Headphones,
  LogOut,
  Palette,
  Refrigerator,
} from "@tamagui/lucide-icons";
import React from "react";
import {
  Avatar,
  Button,
  Card,
  H2,
  H3,
  Paragraph,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { Menu } from "../components/Menu";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

export function ProfileScreen() {
  const { mutate: logout } = useLogoutMutation();

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="마이페이지" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$6" paddingBottom="$8">
          {/* 프로필 */}
          <YStack alignItems="center" gap="$2" marginTop="$4">
            <Avatar circular size={100}>
              <Avatar.Image
                source={{
                  uri: "https://i.pravatar.cc/150?u=fridgely",
                }}
              />
              <Avatar.Fallback bc="$blue10" />
            </Avatar>
            <YStack alignItems="center">
              <H2 fontSize="$4" fontWeight="900">
                Fridgely님
              </H2>
              <Paragraph color="$gray">userId</Paragraph>
            </YStack>
            <Button
              size="$4"
              borderRadius="$4"
              backgroundColor="$iconBackground"
              color="$primary"
              fontWeight="500"
              mt="$2"
            >
              프로필 수정
            </Button>
          </YStack>

          {/* 식품 개수 */}
          <XStack gap="$3" justifyContent="center">
            <Card
              p="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray3"
              backgroundColor="$white"
              f={1}
            >
              <YStack gap="$2">
                <Text color="$gray" fontSize="$4">
                  등록한 식품
                </Text>
                <H3 color="$mainText" fontSize="$5" fontWeight="800">
                  42개
                </H3>
              </YStack>
            </Card>
          </XStack>

          {/* 메뉴  */}
          <YStack
            backgroundColor="$white"
            borderRadius="$4"
            overflow="hidden"
            borderWidth={1}
            borderColor="$gray3"
          >
            <Menu icon={<Bell />} title="알림 설정" />
            <Menu icon={<Refrigerator />} title="냉장고 관리" />
            <Menu icon={<Palette />} title="테마 설정" />
            <Menu icon={<Headphones />} title="고객센터" />
            <Menu
              icon={<LogOut />}
              iconColor="$warning"
              title="로그아웃"
              titleColor="$warning"
              backgroundColor="#FFEDED"
              isLast
              onPress={() => logout()}
            />
          </YStack>

          <YStack alignItems="center" gap="$1" marginTop="$4">
            <Text color="$gray10" fontSize="$2">
              Fridgely App
            </Text>
            <Text color="$gray10" fontSize="$2">
              버전 1.0.0
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
