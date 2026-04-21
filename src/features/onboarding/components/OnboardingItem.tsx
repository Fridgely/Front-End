import { Image } from "expo-image";
import { useWindowDimensions } from "react-native";
import { Paragraph, Text, View, YStack } from "tamagui";
import { OnboardingItemProps } from "../types";
import { fs, ms } from "@/shared/constants/layout";

export function OnboardingItem({ item, isDark }: OnboardingItemProps) {
  const { width: screenWidth } = useWindowDimensions();
  const imageHeight = ms(280);
  return (
    <View w={screenWidth} px="$6">
      <YStack pt="$5" ai="center">
        <View
          w="100%"
          h={imageHeight}
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
        <YStack mt="$5" ai="center">
          <Text
            fontFamily="$heading"
            fontSize={fs(20)}
            fontWeight="800"
            color={isDark ? "#FFFFFF" : "#0B1110"}
            textAlign="center"
            lineHeight={ms(28)}
          >
            {item.title}
          </Text>
          <Paragraph
            mt="$3"
            fontFamily="$baemin"
            fontSize="$3"
            color={isDark ? "#B6C2BF" : "#667085"}
            textAlign="center"
            lineHeight={ms(18)}
          >
            {item.description}
          </Paragraph>
        </YStack>
      </YStack>
    </View>
  );
}
