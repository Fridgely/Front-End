import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export function FridgeListScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} jc="center" ai="center">
        <Text>Fridge List Screen</Text>
      </YStack>
    </SafeAreaView>
  );
}
