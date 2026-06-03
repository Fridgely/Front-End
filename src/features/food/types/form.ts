import type { StorageType } from "@/shared/types/food";
import type { Control } from "react-hook-form";

export interface FoodFormValues {
  imageURL?: string;
  name: string;
  categoryId: number;
  amount: number;
  unit: string;
  expirationDate: Date;
  storageType: StorageType;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  isDefaultType: boolean;
}

export interface FoodFormProps {
  control: Control<FoodFormValues>;
}

export interface QuantityInputProps extends FoodFormProps {
  onInputFocus?: () => void;
}

export interface CategorySelectorProps extends FoodFormProps {
  categories: Category[];
  onModalOpenChange?: (open: boolean) => void;
  fridgeId: number;
}

export interface CategoryFormValues {
  name: string;
}

export interface CategoryFormSheetProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string) => void | Promise<void>;
  editTarget?: Category | null;
  onUpdate?: (categoryId: number, name: string) => void | Promise<void>;
  isPending?: boolean;
}

export interface CategoryActionSheetProps {
  visible: boolean;
  onClose: () => void;
  target: Category | null;
  onEdit: (target: Category) => void;
  onDelete: (target: Category) => void;
}

export interface ImageUploaderProps {
  onPress?: () => void;
  imageURL?: string | null;
}

export interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface DateSelectSheetProps {
  show: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
}

