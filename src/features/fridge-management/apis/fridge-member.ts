import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { FridgeMemberResponse } from "./fridge-member.types";

const getFridgeMembersApi = (fridgeId: number) =>
  ApiBuilder.create<void, FridgeMemberResponse>(
    `/api/v1/refrigerators/${fridgeId}/members`,
  ).setMethod("GET");

export { getFridgeMembersApi };
