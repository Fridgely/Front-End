import type { StorageType } from "@/shared/types/food";
import { Control } from "react-hook-form";

interface FoodFormValues {
  imageURL?: string;
  name: string;
  categoryId: number;
  amount: number;
  unit: string;
  expirationDate: Date;
  storageType: StorageType;
  description?: string;
}

interface Category {
  id: number;
  name: string;
  isDefaultType: boolean;
}

interface FoodFormProps {
  control: Control<FoodFormValues>;
}

interface CategorySelectorProps extends FoodFormProps {
  categories: Category[];
  onModalOpenChange?: (open: boolean) => void;
  fridgeId: number;
}

interface CategoryAddFormValues {
  name: string;
}

interface CategoryAddSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void | Promise<void>;
  isPending?: boolean;
}

interface ImageUploaderProps {
  onPress?: () => void;
  imageURL?: string | null;
}

interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface DateSelectSheetProps {
  show: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
}

export {
  Category,
  CategoryAddFormValues,
  CategoryAddSheetProps,
  CategorySelectorProps,
  DateSelectSheetProps,
  FoodFormProps,
  FoodFormValues,
  ImageUploaderProps,
  UnitSelectorProps,
};
