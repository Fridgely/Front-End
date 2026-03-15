interface NotificationSettingsRequest {
  notificationTime: string; //  ex) "09:00:00"
  daysBeforeExpiration: number;
  enabled: boolean;
}

export { NotificationSettingsRequest };
