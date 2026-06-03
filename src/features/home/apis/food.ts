import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type {
  FridgeFoodsCursorRequest,
  FridgeFoodsResponseRaw,
} from "./food.types";

const getFridgeFoodsApi = (
  fridgeId: number,
  cursorRequest: FridgeFoodsCursorRequest,
) =>
  ApiBuilder.create<void, FridgeFoodsResponseRaw>(
    `/api/v1/refrigerators/${fridgeId}/foods`,
  )
    .setMethod("GET")
    .setParams(cursorRequest);

const deleteFoodApi = (fridgeId: number, foodId: number) =>
  ApiBuilder.create<void, void>(
    `/api/v1/refrigerators/${fridgeId}/foods/${foodId}`,
  ).setMethod("DELETE");

export { deleteFoodApi, getFridgeFoodsApi };
