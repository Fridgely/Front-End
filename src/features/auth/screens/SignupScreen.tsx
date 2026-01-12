import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SignupScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Signup Screen</Text>
        <View style={{ marginTop: 16 }}>
          <Button title="로그인" onPress={() => router.push("/(auth)/login")} />
        </View>
      </View>
    </SafeAreaView>
  );
}
