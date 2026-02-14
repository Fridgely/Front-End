import { UNIT_OPTIONS } from "../constants/food";

const getUnitLabel = (value: string) => {
  return UNIT_OPTIONS.find((option) => option.value === value)?.label || value;
};

export { getUnitLabel };
