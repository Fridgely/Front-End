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

interface QuantityInputProps extends FoodFormProps {
  onInputFocus?: () => void;
}

interface CategorySelectorProps extends FoodFormProps {
  categories: Category[];
  onModalOpenChange?: (open: boolean) => void;
  fridgeId: number;
}

interface CategoryFormValues {
  name: string;
}

interface CategoryFormSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void | Promise<void>;
  editTarget?: Category | null;
  onUpdate?: (categoryId: number, name: string) => void | Promise<void>;
  isPending?: boolean;
}

interface CategoryActionSheetProps {
  visible: boolean;
  onClose: () => void;
  target: Category | null;
  onEdit: (target: Category) => void;
  onDelete: (target: Category) => void;
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
  CategoryActionSheetProps,
  CategoryFormSheetProps,
  CategoryFormValues,
  CategorySelectorProps,
  DateSelectSheetProps,
  FoodFormProps,
  FoodFormValues,
  ImageUploaderProps,
  QuantityInputProps,
  UnitSelectorProps,
};
