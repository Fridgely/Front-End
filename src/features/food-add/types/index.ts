import type { StorageType } from "@/shared/types/food";
import { Control } from "react-hook-form";

interface FoodFormValues {
  imageURL: string | null;
  name: string;
  categoryId: number;
  amount: number;
  unit: string;
  expirationDate: string;
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
}

interface ImageUploaderProps {
  onPress?: () => void;
  imageURL?: string | null;
}

interface UnitSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface DateSelectModalProps {
  show: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
}

export {
  Category,
  CategorySelectorProps,
  DateSelectModalProps,
  FoodFormProps,
  FoodFormValues,
  ImageUploaderProps,
  UnitSelectorProps,
};
