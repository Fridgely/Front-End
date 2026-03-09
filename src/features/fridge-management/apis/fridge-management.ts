import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import {
  FridgeDetailResponse,
  FridgeListResponse,
  UpdateFridgeNameRequest,
  UpdateFridgeNameResponse,
} from "./fridge-management.types";

const getFridgeListApi = () =>
  ApiBuilder.create<void, FridgeListResponse>(
    `/api/v1/refrigerators`,
  ).setMethod("GET");

const getFridgeDetailApi = (fridgeId: number) =>
  ApiBuilder.create<void, FridgeDetailResponse>(
    `/api/v1/refrigerators/${fridgeId}`,
  ).setMethod("GET");

const updateFridgeNameApi = (fridgeId: number) =>
  ApiBuilder.create<UpdateFridgeNameRequest, UpdateFridgeNameResponse>(
    `/api/v1/refrigerators/${fridgeId}`,
  ).setMethod("PATCH");

export { getFridgeDetailApi, getFridgeListApi, updateFridgeNameApi };
