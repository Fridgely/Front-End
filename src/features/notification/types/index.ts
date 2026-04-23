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
  disabled?: boolean;
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

interface NotificationItemProps {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  targetScreen?: string;
  messageId?: string;
}

interface TimePickerSelectProps {
  value: string;
  onValueChange: (time: string) => void;
}

export type {
  DayButtonProps,
  NotificationItemProps,
  PickerColumnProps,
  SettingRowProps,
  TimePickerSelectProps,
};
