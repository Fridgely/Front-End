import "react-native-gesture-handler/jestSetup";

// expo-secure-store 모킹
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock tokenStorage
jest.mock("./src/shared/lib/tokenStorage/tokenStorage");
