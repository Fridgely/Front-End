import ApiBuilder from "@/shared/apis/builder/ApiBuilder";
import type { FridgeResponse } from "./fridge.types";

const getFridgeApi = ApiBuilder.create<void, FridgeResponse>(
  "/api/v1/refrigerators",
).setMethod("GET");

export { getFridgeApi };
