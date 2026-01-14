import { Controller } from "react-hook-form";
import { Input, Text, YStack } from "tamagui";
import { AuthInputProps } from "../types/auth.types";

export function AuthInput({
  label,
  name,
  control,
  errors,
  rules,
  ...props
}: AuthInputProps) {
  return (
    <YStack gap="$2">
      <Text color="$gray12" fontWeight="700" fontSize={14} ml="$1">
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            h={56}
            fontSize={16}
            bc="$gray2"
            // 에러 발생 시 테두리를 빨간색($danger)으로 표시
            bw={errors[name] ? 1.5 : 0}
            boc="$danger"
            br="$3"
            px="$4"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            focusStyle={{ bc: "$white", bw: 2, boc: "$primary" }}
            {...props}
          />
        )}
      />
      {errors[name] && (
        <Text color="$danger" fontSize={12} ml="$1" mt="$1">
          {errors[name]?.message as string}
        </Text>
      )}
    </YStack>
  );
}
