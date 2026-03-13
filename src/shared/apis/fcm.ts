import ApiBuilder from "@/shared/apis/builder/ApiBuilder";

interface RegisterFcmTokenRequest {
  token: string;
}

interface RegisterFcmTokenResponse {
  result: string;
  data: string;
  error: {
    code: string;
    message: string;
    data: string;
  } | null;
}

const registerFcmTokenApi = ApiBuilder.create<
  RegisterFcmTokenRequest,
  RegisterFcmTokenResponse
>("/api/v1/members/me/devices").setMethod("PUT");

export {
  registerFcmTokenApi,
  RegisterFcmTokenRequest,
  RegisterFcmTokenResponse,
};
