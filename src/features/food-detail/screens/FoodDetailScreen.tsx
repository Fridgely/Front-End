import { useLocalSearchParams } from "expo-router";
import { Text, View } from "tamagui";

export function FoodDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View f={1} jc="center" ai="center">
      <Text fontSize="$6">{id}번 식품</Text>
    </View>
  );
}
