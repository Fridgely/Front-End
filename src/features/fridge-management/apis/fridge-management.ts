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

const deleteFridgeApi = (fridgeId: number) =>
  ApiBuilder.create<void, void>(`/api/v1/refrigerators/${fridgeId}`).setMethod(
    "DELETE",
  );

const leaveFridgeApi = (fridgeId: number) =>
  ApiBuilder.create<void, void>(
    `/api/v1/refrigerators/${fridgeId}/me`,
  ).setMethod("POST");

export {
  deleteFridgeApi,
  getFridgeDetailApi,
  getFridgeListApi,
  leaveFridgeApi,
  updateFridgeNameApi,
};
