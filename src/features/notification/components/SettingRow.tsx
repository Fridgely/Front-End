import { ms } from "@/shared/constants/layout";
import React, { memo } from "react";
import { Switch, Text, XStack, YStack } from "tamagui";
import { SettingRowProps } from "../types";

export const SettingRow = memo(
  ({
    icon,
    title,
    description,
    checked,
    onCheckedChange,
    disabled,
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
        disabled={disabled}
        backgroundColor={checked ? "$primary" : "$gray4"}
        height={ms(28)}
        width={ms(46)}
        p={ms(1)}
      >
        <Switch.Thumb size="$4" />
      </Switch>
    </XStack>
  ),
);

SettingRow.displayName = "SettingRow";
