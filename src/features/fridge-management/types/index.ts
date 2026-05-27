import { Fridge, FridgeMember } from "@/shared/types/fridge";

interface FridgeSelectionProps {
  visible: boolean;
  onClose: () => void;
  fridges: Fridge[];
  selectedId: number;
  onSelect: (id: number) => void;
}

interface FridgeNameEditSheetProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
  isLoading?: boolean;
}

interface FridgeMembersProps {
  member: FridgeMember;
  isLast?: boolean;
}

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
  inviteCode: string;
  expirationAt: Date;
  onCopy: () => void;
  onShareKakao: () => void;
}

export {
  FridgeMembersProps,
  FridgeNameEditSheetProps,
  FridgeSelectionProps,
  InviteModalProps,
};
