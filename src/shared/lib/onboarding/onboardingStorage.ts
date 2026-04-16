import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETED_KEY = "onboardingCompleted";

export async function getOnboardingCompleted(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
  return value === "1";
}

export async function setOnboardingCompleted(completed: boolean) {
  await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? "1" : "0");
}

