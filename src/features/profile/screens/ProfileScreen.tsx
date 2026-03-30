import { Header } from "@/shared/components/Header/Header";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import {
  Bell,
  Headphones,
  LogOut,
  Palette,
  Refrigerator,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Heading,
  ScrollView,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { useAllFoodStatusQuery } from "../../home/hooks/queries/useAllFoodStatusQuery";
import { Menu } from "../components/Menu";
import { useMemberProfileQuery } from "../hooks/queries/useMemberProfileQuery";
import { useLogoutMutation } from "../hooks/useLogoutMutation";
import {
  DEFAULT_PROFILE_IMAGES,
  getSavedProfileImage,
  saveProfileImageIndex,
} from "../utils/getRandomDefaultProfileImage";

export function ProfileScreen() {
  const { mutate: logout } = useLogoutMutation();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const { data: allFoodStatusData } = useAllFoodStatusQuery(true);
  const { data: memberProfile } = useMemberProfileQuery();

  const registeredFoodCount =
    (allFoodStatusData?.data?.blackCount ?? 0) +
    (allFoodStatusData?.data?.redCount ?? 0) +
    (allFoodStatusData?.data?.yellowCount ?? 0) +
    (allFoodStatusData?.data?.greenCount ?? 0);

  const nickname = memberProfile?.data?.nickname ?? "Fridgely";
  const [profileImageSource, setProfileImageSource] = React.useState<
    any | null
  >(null);

  React.useEffect(() => {
    const initProfileImage = async () => {
      const profileImageUrl = memberProfile?.data?.profileImageUrl;

      // 1. 업로드된 이미지가 있으면 그것 사용
      if (profileImageUrl && profileImageUrl.trim().length > 0) {
        setProfileImageSource({ uri: profileImageUrl });
        return;
      }

      // 2. 저장된 기본 이미지가 있으면 그것 사용
      const savedImage = await getSavedProfileImage();
      if (savedImage) {
        setProfileImageSource(savedImage);
        return;
      }

      // 3. 없으면 새로 랜덤 선택 후 저장
      const randomIndex = Math.floor(
        Math.random() * DEFAULT_PROFILE_IMAGES.length,
      );
      await saveProfileImageIndex(randomIndex);
      setProfileImageSource(DEFAULT_PROFILE_IMAGES[randomIndex]);
    };

    initProfileImage();
  }, [memberProfile?.data?.profileImageUrl]);

  const handleCustomerSupport = () => {
    // TODO 추후에 건의사항 이메일 변경
    const email = "example@fridgely.com";
    const subject = "Fridgely 건의사항";
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="마이페이지" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$6" paddingBottom="$8">
          {/* 프로필 */}
          <YStack alignItems="center" gap="$2" marginTop="$4">
            <Avatar circular size={100}>
              <Avatar.Image source={profileImageSource} />
              <Avatar.Fallback bc="$blue10" />
            </Avatar>
            <YStack alignItems="center">
              <Heading size="$5" fontWeight="700">
                {nickname}님
              </Heading>
            </YStack>
            <Button
              size="$4"
              borderRadius="$4"
              backgroundColor="$iconBackground"
              color="$primary"
              fontWeight="400"
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
              backgroundColor="$surface"
              f={1}
            >
              <YStack gap="$2">
                <Text color="$gray" fontSize="$4">
                  등록한 식품
                </Text>
                <Heading color="$mainText" size="$5" fontWeight="700">
                  {registeredFoodCount}개
                </Heading>
              </YStack>
            </Card>
          </XStack>

          {/* 메뉴  */}
          <YStack
            backgroundColor="$surface"
            borderRadius="$4"
            overflow="hidden"
            borderWidth={1}
            borderColor="$gray3"
          >
            <Menu
              icon={<Bell />}
              title="알림 설정"
              onPress={() => router.push("/profile/notification-setting")}
            />
            <Menu
              icon={<Refrigerator />}
              title="냉장고 관리"
              onPress={() => router.push("/fridge-management")}
            />
            <Menu
              icon={<Palette />}
              title={
                theme === "light" ? "다크 모드로 변경" : "라이트 모드로 변경"
              }
              onPress={toggleTheme}
            />
            <Menu
              icon={<Headphones />}
              title="문의하기"
              onPress={handleCustomerSupport}
            />
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
            <Text color="$gray10" fontSize="$3">
              Fridgely App
            </Text>
            <Text color="$gray10" fontSize="$3">
              버전 1.0.0
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
