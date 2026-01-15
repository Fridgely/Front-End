import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Spacer, Text, XStack, YStack } from "tamagui";

import { AuthInput } from "../components/AuthInput";
import { AuthFormData } from "../types/auth.types";

export function SignupScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>({
    mode: "onBlur",
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
    console.log("회원가입 데이터:", data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={30}
        keyboardShouldPersistTaps="handled"
      >
        <YStack f={1} px="$6" jc="center" bc="$gray1" py="$10">
          <YStack mb="$6">
            <XStack ai="center" ml="$-2" mb="$4" onPress={() => router.back()}>
              <ArrowLeft size="$1" color="$gray10" />
              <Text color="$gray10" ml="$1">
                로그인으로 돌아가기
              </Text>
            </XStack>
            <H2 fontWeight="900" color="$primary" fontSize={32} ls={-1}>
              회원가입
            </H2>
          </YStack>

          <YStack gap="$3">
            <AuthInput
              label="닉네임"
              name="nickname"
              control={control}
              errors={errors}
              placeholder="닉네임을 입력하세요."
              rules={{ required: "닉네임을 입력해주세요." }}
            />

            <AuthInput
              label="아이디"
              name="id"
              control={control}
              errors={errors}
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
              errors={errors}
              placeholder="비밀번호를 입력하세요."
              secureTextEntry
              rules={{
                required: "비밀번호를 입력해주세요.",
                minLength: { value: 6, message: "최소 6자 이상이어야 합니다." },
              }}
            />

            <AuthInput
              label="비밀번호 확인"
              name="confirmPassword"
              control={control}
              errors={errors}
              placeholder="비밀번호를 다시 입력하세요."
              secureTextEntry
              rules={{
                required: "비밀번호를 다시 입력해주세요.",
                validate: (value: string) =>
                  value === password || "비밀번호가 일치하지 않습니다.",
              }}
            />

            <Spacer size="$4" />

            <Button
              bc="$primary"
              color="$white"
              h={56}
              br="$3"
              fontWeight="800"
              fontSize={18}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              onPress={handleSubmit(onSignUpClick)}
            >
              회원가입
            </Button>
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
