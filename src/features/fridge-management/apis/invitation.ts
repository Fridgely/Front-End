import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import {
  GenerateInviteCodeResponse,
  JoinFridgeByInviteCodeRequest,
  JoinFridgeByInviteCodeResponse,
} from "./invitation.types";

const generateInviteCodeApi = (fridgeId: number) =>
  ApiBuilder.create<void, GenerateInviteCodeResponse>(
    `/api/v1/refrigerators/${fridgeId}/invitation-codes`,
  ).setMethod("POST");

const joinFridgeByInviteCodeApi = () =>
  ApiBuilder.create<
    JoinFridgeByInviteCodeRequest,
    JoinFridgeByInviteCodeResponse
  >(`/api/v1/refrigerators/invitation-codes/join`).setMethod("POST");

export { generateInviteCodeApi, joinFridgeByInviteCodeApi };
