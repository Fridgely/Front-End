import { ImageSourcePropType } from "react-native";

const CATEGORY_IMAGE_MAP: {
  keywords: string[];
  source: ImageSourcePropType;
}[] = [
  {
    keywords: ["과일"],
    source: require("../../../assets/images/categories/category_fruit.webp"),
  },
  {
    keywords: ["야채"],
    source: require("../../../assets/images/categories/category_vegetable.webp"),
  },
  {
    keywords: ["육류"],
    source: require("../../../assets/images/categories/category_meat.webp"),
  },
  {
    keywords: ["해산물"],
    source: require("../../../assets/images/categories/category_seafood.webp"),
  },
  {
    keywords: ["유제품"],
    source: require("../../../assets/images/categories/category_milk.webp"),
  },
  {
    keywords: ["음료"],
    source: require("../../../assets/images/categories/category_beverage.webp"),
  },
  {
    keywords: ["간식"],
    source: require("../../../assets/images/categories/category_snack.webp"),
  },
];

const CATEGORY_ETC_IMAGE = require("../../../assets/images/categories/category_etc.webp");

const getDefaultFoodCategoryImage = (categoryName: string) => {
  const normalized = categoryName.trim();

  const matched = CATEGORY_IMAGE_MAP.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword)),
  );

  return matched?.source ?? CATEGORY_ETC_IMAGE;
};

export { getDefaultFoodCategoryImage };
