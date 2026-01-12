import { Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const LoginScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Text>Login Screen</Text>
      </Stack>
    </SafeAreaView>
  );
};
