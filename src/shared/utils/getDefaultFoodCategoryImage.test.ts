import { getDefaultFoodCategoryImage } from "./getDefaultFoodCategoryImage";

describe("getDefaultFoodCategoryImage 테스트", () => {
  it.each([
    ["과일", require("../../../assets/images/categories/category_fruit.webp")],
    [
      "야채",
      require("../../../assets/images/categories/category_vegetable.webp"),
    ],
    ["육류", require("../../../assets/images/categories/category_meat.webp")],
    [
      "해산물",
      require("../../../assets/images/categories/category_seafood.webp"),
    ],
    ["유제품", require("../../../assets/images/categories/category_milk.webp")],
    [
      "음료",
      require("../../../assets/images/categories/category_beverage.webp"),
    ],
    ["간식", require("../../../assets/images/categories/category_snack.webp")],
  ])(
    "%s 카테고리는 각각의 기본 이미지를 반환해야 한다",
    (categoryName, expected) => {
      expect(getDefaultFoodCategoryImage(categoryName as string)).toEqual(
        expected,
      );
    },
  );

  it.each(["기타", "사용자 추가", "등등", "  "])(
    "%s 는 etc 이미지를 반환해야 한다",
    (categoryName) => {
      expect(getDefaultFoodCategoryImage(categoryName)).toEqual(
        require("../../../assets/images/categories/category_etc.webp"),
      );
    },
  );
});
