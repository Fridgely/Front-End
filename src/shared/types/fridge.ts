type FridgeRole = "OWNER" | "MEMBER";

interface Fridge {
  id: number;
  name: string;
  role: FridgeRole;
  isOwner: boolean;
}

export { Fridge, FridgeRole };
