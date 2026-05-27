type FridgeRole = "OWNER" | "MEMBER";

interface Fridge {
  id: number;
  name: string;
  role: FridgeRole;
  isOwner: boolean;
}

interface FridgeMember {
  memberId: number;
  nickname: string;
  role: FridgeRole;
  isOwner: boolean;
}

export { Fridge, FridgeMember, FridgeRole };
