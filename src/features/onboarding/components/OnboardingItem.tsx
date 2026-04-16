import { Image } from "expo-image";
import { Dimensions } from "react-native";
import { Paragraph, Text, View, YStack } from "tamagui";
import { OnboardingItemProps } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function OnboardingItem({ item, isDark }: OnboardingItemProps) {
  return (
    <View w={SCREEN_WIDTH} px="$6">
      <YStack pt="$6" ai="center">
        <View
          w="100%"
          h={360}
          br="$6"
          bg="#E9E8EB"
          overflow="hidden"
          ai="center"
          jc="center"
        >
          <Image
            source={item.image}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
        <YStack mt="$6" ai="center">
          <Text
            fontFamily="$heading"
            fontSize={26}
            fontWeight="800"
            color={isDark ? "#FFFFFF" : "#0B1110"}
            textAlign="center"
            lineHeight={34}
          >
            {item.title}
          </Text>
          <Paragraph
            mt="$3"
            fontFamily="$baemin"
            fontSize="$3"
            color={isDark ? "#B6C2BF" : "#667085"}
            textAlign="center"
            lineHeight={22}
          >
            {item.description}
          </Paragraph>
        </YStack>
      </YStack>
    </View>
  );
}
