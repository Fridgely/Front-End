import { Controller } from "react-hook-form";
import { Platform } from "react-native";
import { Heading, Input, Text, YStack } from "tamagui";
import { AuthInputProps } from "../types/auth.types";

export function AuthInput({
  label,
  name,
  control,
  errors,
  rules,
  ...props
}: AuthInputProps) {
  const error = errors?.[name];
  return (
    <YStack gap="$2">
      <Heading color="$gray12" fontWeight="700" fontSize="$2" ml="$1">
        {label}
      </Heading>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            h={56}
            fontSize="$3"
            bc="$gray2"
            bw={error ? 1.5 : 0}
            boc="$warning"
            br="$3"
            px="$4"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={{
              fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
            }}
            focusStyle={{ bc: "$white", bw: 2, boc: "$primary" }}
            {...props}
          />
        )}
      />
      {error && (
        <Text color="$warning" fontSize="$3" ml="$1">
          {error.message?.toString()}
        </Text>
      )}
    </YStack>
  );
}
