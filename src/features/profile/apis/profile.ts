import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type { MemberProfileResponse } from "./profile.types";

const logoutApi = ApiBuilder.create<void, void>(
  "/api/v1/auth/logout",
).setMethod("POST");

const getMemberProfileApi = ApiBuilder.create<void, MemberProfileResponse>(
  "/api/v1/members/me",
).setMethod("GET");

const updateMemberProfileImageApi = ApiBuilder.create<FormData, void>(
  "/api/v1/members/me/profile-image",
).setMethod("PATCH");

export { getMemberProfileApi, logoutApi, updateMemberProfileImageApi };
