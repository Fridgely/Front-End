import { Camera } from "@tamagui/lucide-icons";
import { Control, Controller } from "react-hook-form";
import { Circle, Image, Text, YStack } from "tamagui";
import type { FoodFormValues } from "@/features/food/types";
import { fs, ms, s } from "@/shared/constants/layout";
import { useImagePickerActions } from "@/shared/hooks/useImagePickerActions";

export const ImageUploader = ({
  control,
}: {
  control: Control<FoodFormValues>;
}) => {
  const handlePickImage = (onChange: (uri: string) => void) => {
    showPickerAlert({
      onPicked: (asset) => onChange(asset.uri),
      options: { allowsEditing: true, aspect: [1, 1], quality: 1 },
    });
  };

  const { showPickerAlert } = useImagePickerActions();

  return (
    <Controller
      control={control}
      name="imageURL"
      render={({ field: { onChange, value } }) => (
        <YStack
          h={ms(170)}
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
              <Circle size={s(52)} backgroundColor="$background" elevation="$1">
                <Camera size={s(24)} color="$gray" />
              </Circle>
              <Text
                fontFamily="$heading"
                mt="$2"
                color="$gray"
                fontWeight="700"
                fontSize={fs(14)}
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
