import React from "react";
import { Switch, Text, XStack, YStack } from "tamagui";
import { SettingRowProps } from "../types";

export const SettingRow = ({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: SettingRowProps) => (
  <XStack jc="space-between" ai="center">
    <XStack gap="$3" ai="center" f={1}>
      <YStack backgroundColor="$iconBackground" p="$3" br="$4">
        {icon}
      </YStack>
      <YStack f={1}>
        <Text fontSize="$4" fontWeight="700">
          {title}
        </Text>
        <Text fontSize="$3" color="$gray10">
          {description}
        </Text>
      </YStack>
    </XStack>
    <Switch
      size="$4"
      checked={checked}
      onCheckedChange={onCheckedChange}
      backgroundColor={checked ? "$primary" : "$gray4"}
      height={30}
      width={50}
      p={2}
    >
      <Switch.Thumb size="$4" animation="quick" />
    </Switch>
  </XStack>
);
