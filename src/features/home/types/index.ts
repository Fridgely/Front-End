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
  isAllSelected: boolean;
  onSelectAll: () => void;
  onSelect: (fridge: Fridge) => void;
  onPressAdd: () => void;
  data?: Fridge[];
}

interface FoodListItemProps {
  item: FoodItem;
  onPress?: () => void;
}

interface SwipeableFoodListItemProps extends FoodListItemProps {
  onDelete?: (foodId: number) => void;
  isDeleting?: boolean;
}

type CategoryTabType = (typeof STORAGE_TABS)[number];

interface CategoryTabsProps {
  activeTab: CategoryTabType;
  onTabChange: (tab: CategoryTabType) => void;
}

type SortOption = "EXPIRY_ASC" | "REGISTERED_DESC" | "NAME_ASC";

interface SortFilterProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  selectedCategory: string;
  categories: string[];
  onApply: (next: { sort: SortOption; category: string }) => void;
}

export {
  CategoryTabsProps,
  ExpiryProps,
  FoodListItemProps,
  FoodStatus,
  FridgeTabScrollProps,
  SortFilterProps,
  SortOption,
  StatusItemProps,
  SwipeableFoodListItemProps,
};
