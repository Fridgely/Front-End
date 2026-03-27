import { LogIn } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
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

import { useThemeStore } from "@/shared/stores/useThemeStore";
import { useForm } from "react-hook-form";
import { AuthInput } from "../components/AuthInput";
import { useLoginMutation } from "../hooks/useAuthMutation";
import { AuthFormData } from "../types/auth.types";

export function LoginScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const { mutate: login, isPending: isLoginPending } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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
        backgroundColor: theme === "dark" ? "#0B1110" : "#F9FAFB",
      }}
    >
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
            <Heading fontWeight="700" color="$primary" fontSize={30} lh="$6">
              Fridgely
            </Heading>
            <Spacer size="$2" />
            <Paragraph
              fontFamily="$baemin"
              fontWeight="400"
              color="$gray10"
              fontSize="$3"
              lh={24}
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
              h={56}
              br="$3"
              fontWeight="700"
              fontSize="$4"
              icon={LogIn}
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              onPress={handleSubmit(handleLoginClick)}
              disabled={!isValid || isLoginPending}
            >
              로그인하기
            </Button>
          </YStack>

          <YStack mt="$2" ai="center" gap="$3">
            <XStack gap="$2" ai="center">
              <Text
                fontFamily="$baemin"
                fontWeight="400"
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
