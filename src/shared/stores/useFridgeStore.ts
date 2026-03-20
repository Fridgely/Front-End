import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  selectedFridgeId: number | null;
  isAllFridgeTab: boolean;
};

const initialState: State = {
  selectedFridgeId: null,
  isAllFridgeTab: true,
};

const useFridgeStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSelectedFridgeId: (id: number) => {
          set({ selectedFridgeId: id });
        },
        setIsAllFridgeTab: (isAll: boolean) => {
          set({ isAllFridgeTab: isAll });
        },
      },
    })),
    { name: "fridgeStore" },
  ),
);

const useSelectedFridgeId = () =>
  useFridgeStore((state) => state.selectedFridgeId);
const useIsAllFridgeTab = () => useFridgeStore((state) => state.isAllFridgeTab);
const useFridgeActions = () => useFridgeStore((state) => state.actions);

export {
  useFridgeActions,
  useFridgeStore,
  useIsAllFridgeTab,
  useSelectedFridgeId,
};
