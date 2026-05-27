import { FoodItem } from "@/shared/types/food";

interface FoodDetailCardProps {
  food: FoodItem;
}

interface FoodDetailCardRowProps {
  label: string;
  value: string;
}

interface FoodStatusViewProps {
  title: string;
  description?: string;
}

interface ImageSectionProps {
  imageURL?: string;
}

export {
  FoodDetailCardProps,
  FoodDetailCardRowProps,
  FoodStatusViewProps,
  ImageSectionProps,
};
