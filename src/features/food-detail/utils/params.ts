/**
 * URLSearchParams로부터 전달받은 쿼리 파라미터를 숫자로 변환하는 유틸 함수
 * useLocalSearchParams 훅에서 반환되는 값은 string | string[] | undefined 형태이므로, 이를 숫자로 안전하게 변환하기 위한 함수입니다.
 * - string인 경우: 해당 값을 숫자로 변환하여 반환
 * - string[]인 경우: 배열의 첫 번째 요소를 숫자로 변환하여 반환
 * - undefined이거나 변환이 불가능한 경우: null 반환
 * 결론적으로 return 타입은 number | null이 됩니다.
 */

const parseParamToNumber = (
  value: string | string[] | undefined,
): number | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  if (!raw || Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
};

export { parseParamToNumber };
