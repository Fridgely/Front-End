const QUERY_KEYS = {
  fridge: {
    all: ["fridges"] as const,
    list: () => [...QUERY_KEYS.fridge.all, "list"] as const,
    detail: (id: number) => [...QUERY_KEYS.fridge.all, "detail", id] as const,
    members: (id: number) =>
      [...QUERY_KEYS.fridge.detail(id), "members"] as const,
    // 카테고리는 냉장고에 종속적이므로 냉장고 상세 키에 포함시킴
    categories: (id: number) =>
      [...QUERY_KEYS.fridge.detail(id), "categories"] as const,
  },
  food: {
    all: ["foods"] as const,
    statusAll: () => [...QUERY_KEYS.food.all, "status", "all"] as const,
    status: (fridgeId: number) =>
      [...QUERY_KEYS.food.all, "status", fridgeId] as const,
    statusByRefrigerator: (fridgeId: number) =>
      [...QUERY_KEYS.food.all, "statusByRefrigerator", fridgeId] as const,
    detail: (fridgeId: number, foodId: number) =>
      [...QUERY_KEYS.food.all, "detail", fridgeId, foodId] as const,
  },
  notification: {
    all: ["notifications"] as const,
    settings: () => [...QUERY_KEYS.notification.all, "settings"] as const,
  },
  member: {
    all: ["members"] as const,
    me: () => [...QUERY_KEYS.member.all, "me"] as const,
  },
};

export { QUERY_KEYS };
