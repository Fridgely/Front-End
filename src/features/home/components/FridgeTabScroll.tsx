import { Fridge } from "@/shared/types/fridge";
import { Plus } from "@tamagui/lucide-icons";
import { Button, ScrollView, Text, XStack } from "tamagui";
import { FridgeTabScrollProps } from "../types";

const MOCK_REFRIGERATORS: Fridge[] = [
  { id: 1, name: "우리집 냉장고", role: "OWNER", isOwner: true },
  { id: 2, name: "사무실", role: "MEMBER", isOwner: false },
  { id: 3, name: "기숙사", role: "OWNER", isOwner: true },
];
export function FridgeTabScroll({
  selectedId,
  onSelect,
}: FridgeTabScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      <XStack gap="$2" ai="center" backgroundColor="$background">
        {MOCK_REFRIGERATORS.map((fridge) => {
          const isActive = selectedId === fridge.id;
          return (
            <Button
              key={fridge.id}
              onPress={() => onSelect(fridge)}
              bg={isActive ? "$secondary" : "$white"}
              size="$4"
              br="$4"
              px="$5"
              fontSize="$2"
              hoverStyle={{ scale: 0.95 }}
              pressStyle={{ scale: 0.9 }}
            >
              <Text
                color={isActive ? "white" : "$gray"}
                fontWeight={isActive ? "700" : "400"}
              >
                {fridge.name}
              </Text>
            </Button>
          );
        })}

        <Button
          icon={<Plus size="$1" color="$gray" />}
          size="$4"
          bg="$white"
          br="$4"
          px="$3"
          chromeless
        >
          추가
        </Button>
      </XStack>
    </ScrollView>
  );
}
