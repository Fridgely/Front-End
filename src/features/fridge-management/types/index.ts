import { Fridge } from "@/shared/types/fridge";

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

export { FridgeNameEditSheetProps, FridgeSelectionProps };
