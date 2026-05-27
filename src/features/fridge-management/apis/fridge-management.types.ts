import { Fridge } from "@/shared/types/fridge";

interface FridgeListResponse {
  result: string;
  data: Fridge[];
}
interface FridgeDetailResponse {
  result: string;
  data: Fridge;
}
interface UpdateFridgeNameRequest {
  newName: string;
}
interface UpdateFridgeNameResponse {
  result: string;
}

export {
  FridgeDetailResponse,
  FridgeListResponse,
  UpdateFridgeNameRequest,
  UpdateFridgeNameResponse,
};
