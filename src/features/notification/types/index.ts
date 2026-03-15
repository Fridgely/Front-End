import React from "react";

interface PickerColumnProps {
  items: (string | number)[];
  selected: string | number;
  onSelect: (value: any) => void;
  format?: (value: any) => string;
  width?: number;
}

interface DayButtonProps {
  day: number;
  active: boolean;
  onPress: () => void;
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export { DayButtonProps, PickerColumnProps, SettingRowProps };
