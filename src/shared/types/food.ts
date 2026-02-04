type FoodStatus = "BLACK" | "GREEN" | "YELLOW" | "RED";
type StorageType = "REFRIGERATOR" | "FREEZER" | "ROOM_TEMPERATURE";

interface FoodItem {
  id: number;
  name: string;
  categoryName: string;
  imageURL?: string;
  quantity: {
    amount: number;
    unit: string;
  };
  condition: {
    expirationDate: string;
    storageType: StorageType;
    foodStatus: FoodStatus;
    daysLeft: number;
  };
}

export { FoodItem, FoodStatus, StorageType };
