import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type {
  FoodStatusResponse,
  FridgeFoodsCursorRequest,
  FridgeFoodsResponseRaw,
} from "./food.types";

const getFoodStatusApi = ApiBuilder.create<void, FoodStatusResponse>(
  "/api/v1/foods/status",
).setMethod("GET");

const getRefrigeratorFoodsApi = (
  refrigeratorId: number,
  cursorRequest: FridgeFoodsCursorRequest,
) =>
  ApiBuilder.create<void, FridgeFoodsResponseRaw>(
    `/api/v1/refrigerators/${refrigeratorId}/foods`,
  )
    .setMethod("GET")
    .setParams(cursorRequest);

export { getFoodStatusApi, getRefrigeratorFoodsApi };
