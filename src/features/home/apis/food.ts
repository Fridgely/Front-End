import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type {
  FoodStatusResponse,
  FridgeFoodsCursorRequest,
  FridgeFoodsResponseRaw,
} from "./food.types";

const getFoodStatusApi = ApiBuilder.create<void, FoodStatusResponse>(
  "/api/v1/foods/status",
).setMethod("GET");

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

export { deleteFoodApi, getFoodStatusApi, getFridgeFoodsApi };
