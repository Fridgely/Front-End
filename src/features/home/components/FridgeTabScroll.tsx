import { ms, rv } from "@/shared/constants/layout";
import { Plus } from "@tamagui/lucide-icons";
import { Button, ScrollView, Text, XStack } from "tamagui";
import { FridgeTabScrollProps } from "../types";

export function FridgeTabScroll({
  selectedId,
  isAllSelected,
  onSelectAll,
  onSelect,
  data = [],
}: FridgeTabScrollProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: rv({ sm: ms(8), md: ms(12), lg: ms(12) }),
      }}
    >
      <XStack gap="$2" ai="center" backgroundColor="$background">
        <Button
          onPress={onSelectAll}
          bg={isAllSelected ? "$primary" : "$surface"}
          size={rv({ sm: "$3", md: "$4", lg: "$4" })}
          br="$4"
          px={rv({ sm: "$4", md: "$5", lg: "$5" })}
          h={rv({ sm: ms(32), md: ms(36), lg: ms(36) })}
          fontSize="$2"
          hoverStyle={{ scale: 0.95 }}
          pressStyle={{ scale: 0.9 }}
        >
          <Text
            fontFamily="$baemin"
            fontSize={rv({ sm: "$2", md: "$2", lg: "$3" })}
            color={isAllSelected ? "white" : "$gray"}
            fontWeight={isAllSelected ? "700" : "400"}
            pt="$1"
          >
            전체
          </Text>
        </Button>

        {data.map((fridge) => {
          const isActive = !isAllSelected && selectedId === fridge.id;
          return (
            <Button
              key={fridge.id}
              onPress={() => onSelect(fridge)}
              bg={isActive ? "$primary" : "$surface"}
              size={rv({ sm: "$3", md: "$4", lg: "$4" })}
              br="$4"
              px={rv({ sm: "$4", md: "$5", lg: "$5" })}
              h={rv({ sm: ms(32), md: ms(36), lg: ms(36) })}
              fontSize="$2"
              hoverStyle={{ scale: 0.95 }}
              pressStyle={{ scale: 0.9 }}
            >
              <Text
                fontFamily="$baemin"
                fontSize={rv({ sm: "$2", md: "$3", lg: "$3" })}
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
          size={rv({ sm: "$3", md: "$4", lg: "$4" })}
          bg="$surface"
          br="$4"
          px={rv({ sm: "$2", md: "$3", lg: "$3" })}
          h={rv({ sm: ms(32), md: ms(36), lg: ms(36) })}
          chromeless
          fontFamily="$baemin"
          fontSize={rv({ sm: "$2", md: "$3", lg: "$3" })}
          color="$gray"
        >
          추가
        </Button>
      </XStack>
    </ScrollView>
  );
}
