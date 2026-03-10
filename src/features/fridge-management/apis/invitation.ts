import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { GenerateInviteCodeResponse } from "./invitation.types";

const generateInviteCodeApi = (fridgeId: number) =>
  ApiBuilder.create<void, GenerateInviteCodeResponse>(
    `/api/v1/refrigerators/${fridgeId}/invitation-codes`,
  ).setMethod("POST");

export { generateInviteCodeApi };
