import AsyncStorage from "@react-native-async-storage/async-storage";

const LAST_LOGIN_ID_KEY = "lastLoginId";
const REMEMBER_LOGIN_ID_KEY = "rememberLoginId";

export async function getLastLoginId(): Promise<string | null> {
  const value = await AsyncStorage.getItem(LAST_LOGIN_ID_KEY);
  return value ?? null;
}

export async function setLastLoginId(loginId: string): Promise<void> {
  await AsyncStorage.setItem(LAST_LOGIN_ID_KEY, loginId);
}

export async function clearLastLoginId(): Promise<void> {
  await AsyncStorage.removeItem(LAST_LOGIN_ID_KEY);
}

export async function getRememberLoginIdEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(REMEMBER_LOGIN_ID_KEY);
  return value === "1";
}

export async function setRememberLoginIdEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(REMEMBER_LOGIN_ID_KEY, enabled ? "1" : "0");
}

