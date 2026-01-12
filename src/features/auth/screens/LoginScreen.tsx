import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoginScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>안녕</Text>
        <View style={{ marginTop: 16 }}>
          <Button
            title="회원가입"
            onPress={() => router.push("/(auth)/signup")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
