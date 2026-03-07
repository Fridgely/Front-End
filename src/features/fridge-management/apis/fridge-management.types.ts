import { Fridge } from "@/shared/types/fridge";

interface FridgeListResponse {
  result: string;
  data: Fridge[];
}
interface UpdateFridgeNameRequest {
  newName: string;
}
interface UpdateFridgeNameResponse {
  result: string;
}

export {
  FridgeListResponse,
  UpdateFridgeNameRequest,
  UpdateFridgeNameResponse,
};
