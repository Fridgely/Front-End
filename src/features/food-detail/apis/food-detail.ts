import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import { FoodDetailResponse } from "./food-detail.types";

const getFoodDetailApi = (fridgeId: number, foodId: number) =>
  ApiBuilder.create<void, FoodDetailResponse>(
    `/api/v1/refrigerators/${fridgeId}/foods/${foodId}`,
  ).setMethod("GET");

export { getFoodDetailApi };
