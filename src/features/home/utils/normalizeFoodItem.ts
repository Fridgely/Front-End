/**
 * 전체 탭에서 식품 상세 조회페이지로 이동을 위해 냉장고 id를 추출하는 유틸함수
 */

import { FoodItem } from "@/shared/types/food";

const toValidNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const extractRefrigeratorId = (food: FoodItem): number | undefined => {
  const candidateFromDirect = toValidNumber(food.refrigeratorId);
  if (candidateFromDirect !== undefined) {
    return candidateFromDirect;
  }

  const rawFood = food as FoodItem & {
    fridgeId?: unknown;
    refrigerator?: { id?: unknown; refrigeratorId?: unknown };
  };

  const candidateFromFridgeId = toValidNumber(rawFood.fridgeId);
  if (candidateFromFridgeId !== undefined) {
    return candidateFromFridgeId;
  }

  const candidateFromRefrigeratorId = toValidNumber(
    rawFood.refrigerator?.refrigeratorId,
  );
  if (candidateFromRefrigeratorId !== undefined) {
    return candidateFromRefrigeratorId;
  }

  const candidateFromRefrigeratorObjectId = toValidNumber(
    rawFood.refrigerator?.id,
  );
  if (candidateFromRefrigeratorObjectId !== undefined) {
    return candidateFromRefrigeratorObjectId;
  }

  return undefined;
};

const normalizeFoodItem = (
  food: FoodItem,
  fallbackRefrigeratorId?: number,
): FoodItem => {
  const normalizedRefrigeratorId =
    extractRefrigeratorId(food) ?? fallbackRefrigeratorId;

  if (normalizedRefrigeratorId === undefined) {
    return food;
  }

  return {
    ...food,
    refrigeratorId: normalizedRefrigeratorId,
  };
};

export { normalizeFoodItem };
