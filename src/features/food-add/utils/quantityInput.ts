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

  return normalizeQuantity(value + delta, unit);
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

const sanitizeQuantityInput = (text: string, unit: string): string => {
  if (unit !== PIECE_UNIT) {
    return sanitizeDecimalInput(text);
  }

  return text.replace(/,/g, ".").split(".")[0].replace(/[^0-9]/g, "");
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

const normalizeQuantity = (
  value: number | null | undefined,
  unit?: string,
): number => {
  if (!Number.isFinite(value ?? NaN)) {
    return unit === PIECE_UNIT ? MIN_PIECE_QUANTITY : MIN_QUANTITY;
  }

  const numericValue = value as number;

  if (unit === PIECE_UNIT) {
    return Math.max(MIN_PIECE_QUANTITY, Math.round(numericValue));
  }

  return Math.max(MIN_QUANTITY, roundQuantity(numericValue));
};

const formatQuantityDisplay = (value: number, unit?: string): string => {
  const normalized = normalizeQuantity(value, unit);
  return String(normalized);
};

const isQuantityValid = (value: number, unit?: string): boolean => {
  if (unit === PIECE_UNIT) {
    return Number.isInteger(value) && value >= MIN_PIECE_QUANTITY;
  }

  return value >= MIN_QUANTITY;
};

const getQuantityValidationMessage = (unit?: string): string =>
  unit === PIECE_UNIT
    ? "수량은 1 이상의 정수여야 합니다."
    : `수량은 ${MIN_QUANTITY} 이상이어야 합니다.`;

export {
  MIN_PIECE_QUANTITY,
  MIN_QUANTITY,
  PIECE_UNIT,
  adjustQuantity,
  formatQuantityDisplay,
  getQuantityStep,
  getQuantityValidationMessage,
  isQuantityValid,
  normalizeQuantity,
  parseQuantityInput,
  sanitizeDecimalInput,
  sanitizeQuantityInput,
};
