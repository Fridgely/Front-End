import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useColorScheme } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Spacer, Text, XStack, YStack } from "tamagui";

import { AuthInput } from "../components/AuthInput";
import { useSignupMutation } from "../hooks/useAuthMutation";
import { AuthFormData } from "../types/auth.types";
import { fs, ms, rv } from "@/shared/constants/layout";

export function SignupScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark = resolveTheme(theme, systemColorScheme) === "dark";
  const { mutate: signUp, isPending: isSignupPending } = useSignupMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<AuthFormData>({
    mode: "onChange",
    defaultValues: {
      nickname: "",
      id: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 비밀번호 일치 확인을 위해 password 값을 실시간으로 감시
  const password = watch("password");

  const onSignUpClick = (data: AuthFormData) => {
    signUp({
      loginId: data.id,
      password: data.password,
      nickname: data.nickname!,
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
        enableOnAndroid={true}
        extraScrollHeight={rv({ sm: ms(16), md: ms(30), lg: ms(30) })}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          f={1}
          px={rv({ sm: "$5", md: "$6", lg: "$6" })}
          jc="center"
          bc="$gray1"
          py={rv({ sm: "$8", md: "$10", lg: "$10" })}
        >
          <YStack mb="$6">
            <XStack ai="center" ml="$-2" mb="$4" onPress={() => router.back()}>
              <ArrowLeft size="$1" color="$gray10" />
              <Text color="$gray10" ml="$1">
                로그인으로 돌아가기
              </Text>
            </XStack>
            <H2
              fontWeight="900"
              color="$primary"
              fontSize={rv({ sm: fs(24), md: fs(32), lg: fs(32) })}
              ls={-1}
            >
              회원가입
            </H2>
          </YStack>

          <YStack gap="$3">
            <AuthInput
              label="닉네임"
              name="nickname"
              control={control}
              placeholder="닉네임을 입력하세요."
              rules={{
                required: "닉네임을 입력해주세요.",
                minLength: {
                  value: 2,
                  message: "최소 2자 이상 입력해주세요.",
                },
                maxLength: {
                  value: 10,
                  message: "최대 10자까지만 가능합니다.",
                },
                pattern: {
                  value: /^[가-힣a-zA-Z0-9]+$/,
                  message: "특수문자나 공백은 사용할 수 없습니다.",
                },
              }}
            />

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
              rules={{
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value: /^\S+$/,
                  message: "비밀번호에는 공백을 포함할 수 없습니다.",
                },
                minLength: { value: 6, message: "최소 6자 이상이어야 합니다." },
              }}
            />

            <AuthInput
              label="비밀번호 확인"
              name="confirmPassword"
              control={control}
              placeholder="비밀번호를 다시 입력하세요."
              secureTextEntry
              returnKeyType="go"
              blurOnSubmit
              onSubmitEditing={handleSubmit(onSignUpClick)}
              rules={{
                required: "비밀번호를 다시 입력해주세요.",
                validate: (value: string) => {
                  const isMatch = value === password;
                  const isLongEnough = value.length >= 6;

                  // 일치 및 6글자 이상이면 통과
                  if (isMatch && isLongEnough) return true;

                  // 6자 미만일떄 (minLength)
                  if (!isLongEnough) return " ";

                  // 6자 이상인데 틀렸을 때
                  return "비밀번호가 일치하지 않습니다.";
                },
              }}
            />

            <Spacer size="$4" />

            <Button
              bc="$primary"
              color="$white"
              h={rv({ sm: ms(48), md: ms(56), lg: ms(56) })}
              br="$3"
              fontWeight="700"
              fontSize={rv({ sm: fs(14), md: fs(16), lg: fs(16) })}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              onPress={handleSubmit(onSignUpClick)}
              disabled={!isValid || isSignupPending}
            >
              회원가입
            </Button>
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
