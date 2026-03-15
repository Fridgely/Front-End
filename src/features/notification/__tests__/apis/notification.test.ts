import {
  getNotificationSettingsApi,
  updateNotificationSettingsApi,
} from "../../apis/notification";

describe("getNotificationSettingsApi API 테스트", () => {
  it("getNotificationSettingsApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = getNotificationSettingsApi() as any;
    expect(api.endpoint).toBe(`/api/v1/notifications/settings`);
    expect(api.method).toBe("GET");
  });

  it("updateNotificationSettingsApi는 올바른 URL과 메소드로 설정되어야 한다", () => {
    const api = updateNotificationSettingsApi() as any;
    expect(api.endpoint).toBe(`/api/v1/notifications/settings`);
    expect(api.method).toBe("PATCH");
  });
});
