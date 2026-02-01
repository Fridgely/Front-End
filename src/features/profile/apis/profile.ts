import ApiBuilder from "@/shared/apis/builder/ApiBuilder";

const logoutApi = ApiBuilder.create<void, void>(
  "/api/v1/auth/logout",
).setMethod("POST");

export { logoutApi };
