import { LogIn } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Heading,
  Paragraph,
  Spacer,
  Text,
  XStack,
  YStack,
} from "tamagui";

import { fs, ms, rv } from "@/shared/constants/layout";
import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { useForm } from "react-hook-form";
import { AuthInput } from "../components/AuthInput";
import { useLoginMutation } from "../hooks/useAuthMutation";
import { AuthFormData } from "../types/auth.types";

export function LoginScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark = resolveTheme(theme, systemColorScheme) === "dark";
  const { mutate: login, isPending: isLoginPending } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<AuthFormData>({
    mode: "onChange",
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const handleLoginClick = (data: AuthFormData) => {
    login({
      loginId: data.id,
      password: data.password,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0B1110" : "#F9FAFB",
      }}
    >
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={rv({ sm: ms(12), md: ms(20), lg: ms(20) })}
      >
        <YStack
          f={1}
          px={rv({ sm: "$5", md: "$6", lg: "$6" })}
          jc="center"
          bc="$gray1"
        >
          <YStack mb={rv({ sm: ms(24), md: ms(40), lg: ms(40) })}>
            <Heading
              fontWeight="700"
              color="$primary"
              fontFamily="$baemin"
              fontSize={rv({ sm: fs(24), md: fs(28), lg: fs(30) })}
              lh={rv({ sm: ms(30), md: ms(35), lg: ms(40) })}
            >
              Fridgely
            </Heading>
            <Spacer size="$2" />
            <Paragraph
              fontFamily="$baemin"
              fontWeight="400"
              color="$gray10"
              fontSize={rv({ sm: fs(13), md: fs(14), lg: fs(14) })}
              lh={rv({ sm: ms(20), md: ms(24), lg: ms(24) })}
            >
              스마트한 냉장고 관리의 시작.{"\n"}
              버려지는 식재료 없이 신선하게 유지하세요.
            </Paragraph>
          </YStack>

          <YStack gap="$4">
            <AuthInput
              label="아이디"
              name="id"
              control={control}
              placeholder="아이디를 입력하세요."
              keyboardType="default"
              rules={{
                required: "아이디를 입력해주세요.",
                minLength: {
                  value: 4,
                  message: "최소 4자 이상 입력해주세요.",
                },
                pattern: {
                  value: /^[a-z0-9]+$/,
                  message: "영문 소문자와 숫자만 사용 가능합니다.",
                },
              }}
            />

            <AuthInput
              label="비밀번호"
              name="password"
              control={control}
              placeholder="비밀번호를 입력하세요."
              secureTextEntry
              returnKeyType="go"
              blurOnSubmit
              onSubmitEditing={handleSubmit(handleLoginClick)}
              rules={{
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value: /^\S+$/,
                  message: "비밀번호에는 공백을 포함할 수 없습니다.",
                },
                minLength: { value: 6, message: "6자 이상 입력해주세요." },
              }}
            />

            <Spacer size="$2" />

            <Button
              bc="$primary"
              color="$white"
              h={rv({ sm: ms(48), md: ms(56), lg: ms(56) })}
              br="$3"
              fontWeight="700"
              fontSize={rv({ sm: fs(14), md: fs(15), lg: fs(16) })}
              icon={LogIn}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              onPress={handleSubmit(handleLoginClick)}
              disabled={!isValid || isLoginPending}
            >
              로그인하기
            </Button>
          </YStack>

          <YStack mt="$2" ai="center" gap="$3">
            <XStack ai="center">
              <Text
                fontFamily="$baemin"
                fontWeight="700"
                color="$gray10"
                fontSize="$3"
              >
                계정이 없으신가요?
              </Text>
              <Text
                fontFamily="$baemin"
                color="$primary"
                fontWeight="700"
                fontSize="$3"
                onPress={() => router.push("/signup")}
              >
                회원가입
              </Text>
            </XStack>

            {/* 비밀번호 변경 필요시 추가 
          <Text color="$gray10" fontSize={14} onPress={() => {}}>
            비밀번호를 잊으셨나요?
          </Text> */}
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
