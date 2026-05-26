const MIN_QUANTITY = 0.01;
const MIN_PIECE_QUANTITY = 1;
const MAX_DECIMAL_PLACES = 2;
const DECIMAL_QUANTITY_STEP = 0.1;
const PIECE_UNIT = "PIECE";

const getQuantityStep = (unit: string): number =>
  unit === PIECE_UNIT ? 1 : DECIMAL_QUANTITY_STEP;

const adjustQuantity = (
  value: number,
  unit: string,
  direction: "up" | "down",
): number => {
  const step = getQuantityStep(unit);
  const delta = direction === "up" ? step : -step;

  if (unit === PIECE_UNIT) {
    const next = Math.round(value + delta);
    return Math.max(MIN_PIECE_QUANTITY, next);
  }

  return normalizeQuantity(value + delta);
};

const sanitizeDecimalInput = (text: string): string => {
  let cleaned = text.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const dotIndex = cleaned.indexOf(".");

  if (dotIndex === -1) {
    return cleaned;
  }

  const intPart = cleaned.slice(0, dotIndex);
  const decPart = cleaned
    .slice(dotIndex + 1)
    .replace(/\./g, "")
    .slice(0, MAX_DECIMAL_PLACES);

  if (decPart.length === 0 && !cleaned.endsWith(".")) {
    return intPart;
  }

  return `${intPart}.${decPart}`;
};

const parseQuantityInput = (text: string): number | null => {
  const trimmed = text.trim();
  if (!trimmed || trimmed === ".") {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

const roundQuantity = (value: number): number =>
  Math.round(value * 10 ** MAX_DECIMAL_PLACES) / 10 ** MAX_DECIMAL_PLACES;

const normalizeQuantity = (value: number | null | undefined): number => {
  const numericValue = value ?? MIN_QUANTITY;

  if (!Number.isFinite(numericValue)) {
    return MIN_QUANTITY;
  }

  return Math.max(MIN_QUANTITY, roundQuantity(numericValue));
};

const formatQuantityDisplay = (value: number): string => {
  const rounded = roundQuantity(value);
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

const isQuantityValid = (value: number): boolean => value >= MIN_QUANTITY;

export {
  MIN_QUANTITY,
  PIECE_UNIT,
  adjustQuantity,
  formatQuantityDisplay,
  getQuantityStep,
  isQuantityValid,
  normalizeQuantity,
  parseQuantityInput,
  sanitizeDecimalInput,
};
