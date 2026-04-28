import { Header } from "@/shared/components/Header/Header";
import {
  fs,
  getBottomPaddingForSheet,
  ms,
  rv,
} from "@/shared/constants/layout";
import { useThemeStore } from "@/shared/stores/useThemeStore";
import {
  Bell,
  Headphones,
  LogOut,
  Palette,
  Refrigerator,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useUpdateProfileImageMutation } from "../hooks/useUpdateProfileImageMutation";
import {
  clearSavedProfileImage,
  DEFAULT_PROFILE_IMAGES,
  getSavedProfileImage,
  saveProfileImageIndex,
} from "../utils/getRandomDefaultProfileImage";
import { useImagePickerActions } from "@/shared/hooks/useImagePickerActions";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { mutate: logout } = useLogoutMutation();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const themeLabel =
    theme === "system" ? "시스템" : theme === "dark" ? "다크" : "라이트";
  const { data: allFoodStatusData } = useAllFoodStatusQuery(true);
  const { data: memberProfile } = useMemberProfileQuery();

  const registeredFoodCount =
    (allFoodStatusData?.data?.blackCount ?? 0) +
    (allFoodStatusData?.data?.redCount ?? 0) +
    (allFoodStatusData?.data?.yellowCount ?? 0) +
    (allFoodStatusData?.data?.greenCount ?? 0);

  const loginId = memberProfile?.data?.loginId ?? "anonymous";
  const nickname = memberProfile?.data?.nickname ?? "Fridgely";
  const { mutate: updateProfileImage, isPending: isUpdatingProfileImage } =
    useUpdateProfileImageMutation(loginId);
  const { showPickerAlert } = useImagePickerActions();
  const [profileImageSource, setProfileImageSource] = React.useState<
    any | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    const initProfileImage = async () => {
      const profileImageUrl = memberProfile?.data?.profileImageUrl;

      // 1. 업로드된 이미지가 있으면 그것 사용
      if (profileImageUrl && profileImageUrl.trim().length > 0) {
        await clearSavedProfileImage(loginId);
        if (!cancelled) {
          setProfileImageSource({ uri: profileImageUrl });
        }
        return;
      }

      // 2. 저장된 기본 이미지가 있으면 그것 사용
      const savedImage = await getSavedProfileImage(loginId);
      if (cancelled) {
        return;
      }

      if (savedImage) {
        setProfileImageSource(savedImage);
        return;
      }

      // 3. 없으면 새로 랜덤 선택 후 저장
      const randomIndex = Math.floor(
        Math.random() * DEFAULT_PROFILE_IMAGES.length,
      );
      await saveProfileImageIndex(loginId, randomIndex);
      if (!cancelled) {
        setProfileImageSource(DEFAULT_PROFILE_IMAGES[randomIndex]);
      }
    };

    initProfileImage();

    return () => {
      cancelled = true;
    };
  }, [loginId, memberProfile?.data?.profileImageUrl]);

  const handleCustomerSupport = () => {
    // TODO 추후에 건의사항 이메일 변경
    const email = "example@fridgely.com";
    const subject = "Fridgely 건의사항";
    Linking.openURL(`mailto:${email}?subject=${subject}`);
  };

  const handleProfileImageUpdate = async () => {
    showPickerAlert({
      title: "프로필 사진 변경",
      message: "원하는 방법을 선택하세요.",
      options: { allowsEditing: true, aspect: [1, 1], quality: 1 },
      onPicked: (asset) => {
        updateProfileImage({
          uri: asset.uri,
          fileName: asset.fileName ?? undefined,
          mimeType: asset.mimeType ?? undefined,
        });
      },
    });
  };

  return (
    <YStack f={1} backgroundColor="$background">
      <Header title="마이페이지" showBackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack
          padding={rv({ sm: "$3", md: "$4", lg: "$4" })}
          gap={rv({ sm: "$5", md: "$6", lg: "$6" })}
          style={{
            paddingBottom: getBottomPaddingForSheet({
              bottomInset: insets.bottom,
            }),
          }}
        >
          {/* 프로필 */}
          <YStack
            alignItems="center"
            gap="$2"
            marginTop={rv({ sm: "$3", md: "$4", lg: "$4" })}
          >
            <Avatar circular size={rv({ sm: ms(72), md: ms(86), lg: ms(86) })}>
              <Avatar.Image source={profileImageSource} />
              <Avatar.Fallback bc="$blue10" />
            </Avatar>
            <YStack alignItems="center">
              <Heading
                size="$5"
                fontWeight="700"
                fontSize={rv({ sm: fs(16), md: fs(18), lg: fs(18) })}
              >
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
              onPress={handleProfileImageUpdate}
              disabled={isUpdatingProfileImage}
            >
              <Text
                fontFamily="$baemin"
                fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
                fontWeight="600"
              >
                {isUpdatingProfileImage ? "업로드 중..." : "프로필 수정"}
              </Text>
            </Button>
          </YStack>

          {/* 식품 개수 */}
          <XStack gap="$3" justifyContent="center">
            <Card
              p={rv({ sm: "$3", md: "$4", lg: "$4" })}
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray3"
              backgroundColor="$surface"
              f={1}
            >
              <YStack gap="$2">
                <Text
                  color="$gray"
                  fontSize={rv({ sm: fs(11), md: fs(13), lg: fs(13) })}
                  fontFamily="$baemin"
                >
                  등록한 식품
                </Text>
                <Heading
                  color="$mainText"
                  size="$5"
                  fontWeight="700"
                  fontSize={rv({ sm: fs(15), md: fs(18), lg: fs(18) })}
                >
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
              title={`테마 : ${themeLabel}`}
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

          <YStack
            alignItems="center"
            gap="$1"
            marginTop={rv({ sm: "$3", md: "$4", lg: "$4" })}
          >
            <Text
              color="$gray10"
              fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
            >
              Fridgely App
            </Text>
            <Text
              color="$gray10"
              fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
            >
              버전 1.0.0
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
