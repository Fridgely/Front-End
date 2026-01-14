import { LogIn } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, H2, Paragraph, Spacer, Text, XStack, YStack } from "tamagui";

import { useForm } from "react-hook-form";
import { AuthInput } from "../components/AuthInput";
import { AuthFormData } from "../types/auth.types";

export function LoginScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginClick = (data: AuthFormData) => {
    console.log("로그인 데이터:", data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <YStack f={1} px="$6" jc="center" bc="$gray1">
          <YStack mb={40}>
            <H2 fontWeight="900" color="$primary" fontSize={32} ls={-1}>
              Fridgely
            </H2>
            <Spacer size="$2" />
            <Paragraph color="$gray10" fontSize={16} lh={24}>
              스마트한 냉장고 관리의 시작.{"\n"}
              버려지는 식재료 없이 신선하게 유지하세요.
            </Paragraph>
          </YStack>

          <YStack gap="$4">
            <AuthInput
              label="이메일 주소"
              name="email"
              control={control}
              errors={errors}
              placeholder="example@fridgely.com"
              keyboardType="email-address"
              rules={{
                required: "이메일을 입력해주세요.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "유효한 이메일 형식이 아닙니다.",
                },
              }}
            />

            <AuthInput
              label="비밀번호"
              name="password"
              control={control}
              errors={errors}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry
              rules={{
                required: "비밀번호를 입력해주세요.",
                minLength: { value: 6, message: "6자 이상 입력해주세요." },
              }}
            />

            <Spacer size="$2" />

            <Button
              bc="$primary"
              color="$white"
              h={56}
              br="$3"
              fontWeight="800"
              fontSize={18}
              icon={LogIn}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              onPress={handleSubmit(handleLoginClick)}
            >
              로그인하기
            </Button>
          </YStack>

          <YStack mt="$2" ai="center" gap="$3">
            <XStack gap="$2" ai="center">
              <Text color="$gray10" fontSize={15}>
                계정이 없으신가요?
              </Text>
              <Text
                color="$primary"
                fontWeight="800"
                fontSize={15}
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
