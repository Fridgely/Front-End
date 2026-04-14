import { resolveTheme, useThemeStore } from "@/shared/stores/useThemeStore";
import { Controller } from "react-hook-form";
import { Platform, useColorScheme } from "react-native";
import { Heading, Input, Text, YStack } from "tamagui";
import { AuthInputProps } from "../types/auth.types";

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
      <Heading color="$mainText" fontWeight="700" fontSize="$2" ml="$1">
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
                h={56}
                fontSize="$3"
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
                <Text color="$warning" fontSize="$3" ml="$1" mt="$2">
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
