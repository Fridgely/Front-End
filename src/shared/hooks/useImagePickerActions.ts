import { Alert, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";

type PickerOptions = {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
};

export type PickedImageAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

const defaultOptions: Required<PickerOptions> = {
  allowsEditing: true,
  aspect: [1, 1],
  quality: 1,
};

function openPermissionSettings() {
  Linking.openSettings();
}

function normalizeOptions(options?: PickerOptions): Required<PickerOptions> {
  return {
    allowsEditing: options?.allowsEditing ?? defaultOptions.allowsEditing,
    aspect: options?.aspect ?? defaultOptions.aspect,
    quality: options?.quality ?? defaultOptions.quality,
  };
}

function getSelectedAsset(
  result: ImagePicker.ImagePickerResult,
): PickedImageAsset | null {
  if (result.canceled) return null;
  const asset = result.assets?.[0];
  if (!asset?.uri) return null;

  return {
    uri: asset.uri,
    fileName: asset.fileName ?? null,
    mimeType: asset.mimeType ?? null,
  };
}

export function useImagePickerActions() {
  const pickFromLibrary = async (
    options?: PickerOptions,
  ): Promise<PickedImageAsset | null> => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "권한 필요",
        "사진을 등록하려면 사진첩 접근 권한이 필요합니다.",
        [
          { text: "취소", style: "cancel" },
          { text: "설정으로 이동", onPress: openPermissionSettings },
        ],
      );
      return null;
    }

    const normalized = normalizeOptions(options);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: normalized.allowsEditing,
      aspect: normalized.aspect,
      quality: normalized.quality,
    });

    return getSelectedAsset(result);
  };

  const pickFromCamera = async (
    options?: PickerOptions,
  ): Promise<PickedImageAsset | null> => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "권한 필요",
        "사진을 촬영하려면 카메라 접근 권한이 필요합니다.",
        [
          { text: "취소", style: "cancel" },
          { text: "설정으로 이동", onPress: openPermissionSettings },
        ],
      );
      return null;
    }

    const normalized = normalizeOptions(options);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: normalized.allowsEditing,
      aspect: normalized.aspect,
      quality: normalized.quality,
    });

    return getSelectedAsset(result);
  };

  const showPickerAlert = (params: {
    title?: string;
    message?: string;
    options?: PickerOptions;
    onPicked: (asset: PickedImageAsset) => void | Promise<void>;
  }) => {
    const title = params.title ?? "사진 등록";
    const message = params.message ?? "원하는 방법을 선택하세요.";

    Alert.alert(title, message, [
      { text: "취소", style: "cancel" },
      {
        text: "카메라로 촬영",
        onPress: async () => {
          const asset = await pickFromCamera(params.options);
          if (asset) await params.onPicked(asset);
        },
      },
      {
        text: "앨범에서 선택",
        onPress: async () => {
          const asset = await pickFromLibrary(params.options);
          if (asset) await params.onPicked(asset);
        },
      },
    ]);
  };

  return { pickFromLibrary, pickFromCamera, showPickerAlert };
}

