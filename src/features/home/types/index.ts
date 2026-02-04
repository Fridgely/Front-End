import { STORAGE_TABS } from "@/shared/constants/food";
import { FoodItem, FoodStatus } from "@/shared/types/food";
import { Fridge } from "@/shared/types/fridge";

interface ExpiryProps {
  counts: {
    BLACK: number;
    RED: number;
    YELLOW: number;
    GREEN: number;
  };
  activeStatus: FoodStatus | null;
  onStatusChange: (status: FoodStatus) => void;
}

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  sub: string;
  color: string;
  onPress: () => void;
  opacity: number;
}

interface FridgeTabScrollProps {
  selectedId: number | null;
  onSelect: (fridge: Fridge) => void;

  data?: Fridge[];
}

interface FoodListItemProps {
  item: FoodItem;
}

type CategoryTabType = (typeof STORAGE_TABS)[number];

interface CategoryTabsProps {
  activeTab: CategoryTabType;
  onTabChange: (tab: CategoryTabType) => void;
}

export {
  CategoryTabsProps,
  ExpiryProps,
  FoodListItemProps,
  FoodStatus,
  FridgeTabScrollProps,
  StatusItemProps,
};
