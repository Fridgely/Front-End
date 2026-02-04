import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type { FoodStatusResponse } from "./food.types";

const getFoodStatusApi = ApiBuilder.create<void, FoodStatusResponse>(
  "/api/v1/foods/status",
).setMethod("GET");

export { getFoodStatusApi };
