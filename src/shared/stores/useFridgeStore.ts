import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  selectedFridgeId: number | null;
};

const initialState: State = {
  selectedFridgeId: null,
};

const useFridgeStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setSelectedFridgeId: (id: number) => {
          set({ selectedFridgeId: id });
        },
      },
    })),
    { name: "fridgeStore" },
  ),
);

const useSelectedFridgeId = () =>
  useFridgeStore((state) => state.selectedFridgeId);
const useFridgeActions = () => useFridgeStore((state) => state.actions);

export { useFridgeActions, useFridgeStore, useSelectedFridgeId };
