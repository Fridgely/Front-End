const QUERY_KEYS = {
  fridge: {
    all: ["fridges"] as const,
    list: () => [...QUERY_KEYS.fridge.all, "list"] as const,
    detail: (id: number) => [...QUERY_KEYS.fridge.all, "detail", id] as const,
  },
  food: {
    all: ["foods"] as const,
    status: (fridgeId: number) =>
      [...QUERY_KEYS.food.all, "status", fridgeId] as const,
  },
};

export { QUERY_KEYS };
