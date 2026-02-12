import { useFridgeStore } from "./useFridgeStore";

describe("FridgeStore 테스트", () => {
  beforeEach(() => {
    useFridgeStore.setState({
      selectedFridgeId: null,
    });
  });

  it("초기 상태의 selectedFridgeId는 null이어야 한다.", () => {
    const state = useFridgeStore.getState();
    expect(state.selectedFridgeId).toBeNull();
  });

  it("setSelectedFridgeId 액션이 selectedFridgeId 상태를 변경해야 한다.", () => {
    const { setSelectedFridgeId } = useFridgeStore.getState().actions;
    const testId = 123;

    setSelectedFridgeId(testId);

    expect(useFridgeStore.getState().selectedFridgeId).toBe(testId);
  });

  it("마지막으로 설정한 ID가 반영되어야 한다.", () => {
    const { setSelectedFridgeId } = useFridgeStore.getState().actions;

    setSelectedFridgeId(1);
    setSelectedFridgeId(99);

    expect(useFridgeStore.getState().selectedFridgeId).toBe(99);
  });
});
