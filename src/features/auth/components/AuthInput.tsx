import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { Controller } from "react-hook-form";
import { Platform, useColorScheme } from "react-native";
import { Heading, Input, Text, YStack } from "tamagui";
import { AuthInputProps } from "../types/auth.types";
import { fs, ms, rv } from "@/shared/constants/layout";

export function AuthInput({
  label,
  name,
  control,
  rules,
  ...props
}: AuthInputProps) {
  const theme = useThemeStore((state) => state.theme);
  const systemColorScheme = useColorScheme();
  const isDark = resolveTheme(theme, systemColorScheme) === "dark";

  return (
    <YStack gap="$2">
      <Heading
        color="$mainText"
        fontWeight="700"
        fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
        ml="$1"
      >
        {label}
      </Heading>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState }) => {
          const hasError =
            !!fieldState.error && fieldState.error.message?.trim() !== "";

          return (
            <YStack>
              <Input
                h={rv({ sm: ms(44), md: ms(52), lg: ms(52) })}
                fontSize={rv({ sm: fs(13), md: fs(14), lg: fs(14) })}
                bc="$surface"
                bw={hasError ? 1.5 : 0}
                boc="$warning"
                br="$3"
                px="$4"
                color="$mainText"
                placeholderTextColor={isDark ? "#4A5A56" : "#9CA3AF"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{
                  fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
                }}
                focusStyle={{
                  bc: "$surface",
                  bw: 2,
                  boc: hasError ? "$warning" : "$primary",
                }}
                {...props}
              />
              {hasError && (
                <Text
                  color="$warning"
                  fontSize={rv({ sm: fs(12), md: fs(13), lg: fs(13) })}
                  ml="$1"
                  mt="$2"
                >
                  {fieldState.error?.message}
                </Text>
              )}
            </YStack>
          );
        }}
      />
    </YStack>
  );
}
