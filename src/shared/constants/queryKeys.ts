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
    status: (fridgeId: number) =>
      [...QUERY_KEYS.food.all, "status", fridgeId] as const,
  },
  notification: {
    all: ["notifications"] as const,
    settings: () => [...QUERY_KEYS.notification.all, "settings"] as const,
  },
};

export { QUERY_KEYS };
