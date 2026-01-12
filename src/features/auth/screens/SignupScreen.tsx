import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "tamagui";

export const SignupScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Text>Signup Screen</Text>
      </Stack>
    </SafeAreaView>
  );
};
