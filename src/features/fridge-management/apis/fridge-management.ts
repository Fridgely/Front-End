import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { FridgeListResponse } from "./fridge-management.types";

const getFridgeListApi = () =>
  ApiBuilder.create<void, FridgeListResponse>(
    `/api/v1/refrigerators`,
  ).setMethod("GET");

export { getFridgeListApi };
