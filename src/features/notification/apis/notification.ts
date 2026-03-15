import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { NotificationSettingsRequest } from "./notification.types";

const getNotificationSettingsApi = () =>
  ApiBuilder.create<void, { data: NotificationSettingsRequest }>(
    "/api/v1/notifications/settings",
  ).setMethod("GET");

const updateNotificationSettingsApi = () =>
  ApiBuilder.create<NotificationSettingsRequest, void>(
    "/api/v1/notifications/settings",
  ).setMethod("PATCH");

export { getNotificationSettingsApi, updateNotificationSettingsApi };
