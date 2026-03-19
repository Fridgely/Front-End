const getExpiryLabel = (dateString: string, daysLeft: number) => {
  if (daysLeft === 0) return "오늘 만료";
  if (daysLeft === 1) return "내일 만료";

  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
};

const formatNotificationTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "방금 전";
  if (diffInMins < 60) return `${diffInMins}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  if (diffInDays < 7) return `${diffInDays}일 전`;

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
};

export { formatNotificationTime, getExpiryLabel };
