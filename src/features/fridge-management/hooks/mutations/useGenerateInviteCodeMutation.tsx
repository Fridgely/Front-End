import { useApiMutation } from "@/shared/apis/builder/ApiBuilder";
import { generateInviteCodeApi } from "../../apis/invitation";
import { GenerateInviteCodeResponse } from "../../apis/invitation.types";

export const useGenerateInviteCodeMutation = (fridgeId: number) => {
  return useApiMutation<void, GenerateInviteCodeResponse>(
    generateInviteCodeApi(fridgeId),
  );
};
