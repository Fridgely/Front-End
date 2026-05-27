import {
  adjustQuantity,
  formatQuantityDisplay,
  getQuantityStep,
  isQuantityValid,
  normalizeQuantity,
  parseQuantityInput,
  sanitizeDecimalInput,
  sanitizeQuantityInput,
} from "../../utils/quantityInput";

describe("quantityInput", () => {
  describe("sanitizeDecimalInput", () => {
    it("숫자와 소수점만 허용한다", () => {
      expect(sanitizeDecimalInput("1.5kg")).toBe("1.5");
      expect(sanitizeDecimalInput("12")).toBe("12");
    });

    it("소수점은 하나만 허용하고 소수 둘째 자리까지만 허용한다", () => {
      expect(sanitizeDecimalInput("1.234")).toBe("1.23");
      expect(sanitizeDecimalInput("1..2")).toBe("1.2");
    });

    it("입력 중인 소수점 문자열을 유지한다", () => {
      expect(sanitizeDecimalInput("1.")).toBe("1.");
    });
  });

  describe("parseQuantityInput", () => {
    it("유효한 숫자 문자열을 파싱한다", () => {
      expect(parseQuantityInput("1.5")).toBe(1.5);
    });

    it("빈 값이나 소수점만 있으면 null을 반환한다", () => {
      expect(parseQuantityInput("")).toBeNull();
      expect(parseQuantityInput(".")).toBeNull();
    });
  });

  describe("sanitizeQuantityInput", () => {
    it("개 단위는 정수만 허용한다", () => {
      expect(sanitizeQuantityInput("1.5", "PIECE")).toBe("1");
      expect(sanitizeQuantityInput("2", "PIECE")).toBe("2");
    });
  });

  describe("normalizeQuantity", () => {
    it("최소 수량 미만이면 최소값으로 보정한다", () => {
      expect(normalizeQuantity(0)).toBe(0.01);
      expect(normalizeQuantity(0, "PIECE")).toBe(1);
    });

    it("소수 둘째 자리까지 반올림한다", () => {
      expect(normalizeQuantity(1.239)).toBe(1.24);
    });

    it("개 단위는 정수로 반올림하고 최소 1을 유지한다", () => {
      expect(normalizeQuantity(1.6, "PIECE")).toBe(2);
      expect(normalizeQuantity(0.2, "PIECE")).toBe(1);
    });
  });

  describe("isQuantityValid", () => {
    it("개 단위는 1 이상의 정수만 유효하다", () => {
      expect(isQuantityValid(2, "PIECE")).toBe(true);
      expect(isQuantityValid(1.5, "PIECE")).toBe(false);
      expect(isQuantityValid(0, "PIECE")).toBe(false);
    });

    it("그 외 단위는 최소 수량 이상이면 유효하다", () => {
      expect(isQuantityValid(0.5, "L")).toBe(true);
      expect(isQuantityValid(0, "L")).toBe(false);
    });
  });

  describe("getQuantityStep", () => {
    it("단위가 개(PIECE)이면 1씩, 그 외에는 0.1씩 조절한다", () => {
      expect(getQuantityStep("PIECE")).toBe(1);
      expect(getQuantityStep("L")).toBe(0.1);
      expect(getQuantityStep("KG")).toBe(0.1);
    });
  });

  describe("adjustQuantity", () => {
    it("개 단위는 정수로 1씩 조절하고 최소 1을 유지한다", () => {
      expect(adjustQuantity(2, "PIECE", "up")).toBe(3);
      expect(adjustQuantity(1, "PIECE", "down")).toBe(1);
    });

    it("그 외 단위는 0.1씩 조절한다", () => {
      expect(adjustQuantity(1, "L", "up")).toBe(1.1);
      expect(adjustQuantity(1.1, "KG", "down")).toBe(1);
    });
  });

  describe("formatQuantityDisplay", () => {
    it("정수는 소수점 없이 표시한다", () => {
      expect(formatQuantityDisplay(2)).toBe("2");
    });

    it("소수는 불필요한 0을 제거하지 않고 표시한다", () => {
      expect(formatQuantityDisplay(1.5)).toBe("1.5");
    });
  });
});
