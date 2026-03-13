import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import {
  registerFcmTokenApi,
  type RegisterFcmTokenRequest,
  type RegisterFcmTokenResponse,
} from "@/shared/apis/fcm";

export const useFcmMutation = () => {
  return useApiMutation<RegisterFcmTokenRequest, RegisterFcmTokenResponse>(
    registerFcmTokenApi,
  );
};
