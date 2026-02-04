const getExpiryLabel = (dateString: string, daysLeft: number) => {
  if (daysLeft === 0) return "오늘 만료";
  if (daysLeft === 1) return "내일 만료";

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
};

export { getExpiryLabel };
