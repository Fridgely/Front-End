import { Image } from "react-native";
import { Text, View } from "tamagui";
import { ImageSectionProps } from "../types";

export function ImageSection({ imageURL }: ImageSectionProps) {
  return (
    <View h={220} br="$5" bc="$gray3" ov="hidden" ai="center" jc="center">
      {imageURL ? (
        <Image
          source={{ uri: imageURL }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      ) : (
        <Text color="$gray10" fontFamily="$baemin">
          등록된 사진이 없습니다.
        </Text>
      )}
    </View>
  );
}
