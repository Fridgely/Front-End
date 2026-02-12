import { Camera } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import { Control, Controller } from "react-hook-form";
import { Circle, Image, Text, YStack } from "tamagui";
import { FoodFormValues } from "../types";

export const ImageUploader = ({
  control,
}: {
  control: Control<FoodFormValues>;
}) => {
  const handlePickImage = async (onChange: (uri: string) => void) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("사진첩 접근 권한이 거부되었습니다.");
      return;
    }

    // NOTE: 이미지 선택기 (아래 옵션들 수정 예정)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 이미지만 선택 가능
      allowsEditing: true, // 크롭 등 편집 허용
      aspect: [1, 1], // 1:1 비율로 제한
      quality: 1, // 화질 설정 (0~1)
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <Controller
      control={control}
      name="imageURL"
      render={({ field: { onChange, value } }) => (
        <YStack
          h={200}
          backgroundColor="$gray3"
          br="$5"
          bw={1}
          boc="$gray4"
          ai="center"
          jc="center"
          pressStyle={{ opacity: 0.7 }}
          onPress={() => handlePickImage(onChange)}
          overflow="hidden"
        >
          {value ? (
            <Image
              source={{ uri: value }}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <YStack ai="center">
              <Circle size={56} backgroundColor="$background" elevation="$1">
                <Camera size={28} color="$gray" />
              </Circle>
              <Text
                fontFamily="$heading"
                mt="$2"
                color="$gray"
                fontWeight="700"
              >
                이미지 등록
              </Text>
            </YStack>
          )}
        </YStack>
      )}
    />
  );
};
