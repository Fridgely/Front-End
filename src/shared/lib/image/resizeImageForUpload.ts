export type ResizeImageForUploadParams = {
  uri: string;
  /**
   * 긴 변 기준 최대 크기. 기본 1280
   */
  maxSize?: number;
  /**
   * JPEG 압축률 (0~1). 기본 0.8
   */
  compress?: number;
};

export type ResizedImage = {
  uri: string;
  fileName: string;
  mimeType: "image/jpeg";
};

async function getImageSize(
  uri: string,
): Promise<{ width: number; height: number }> {
  const { Image } = await import("react-native");

  return await new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error),
    );
  });
}

export async function resizeImageForUpload(
  params: ResizeImageForUploadParams,
): Promise<ResizedImage> {
  let ImageManipulator: typeof import("expo-image-manipulator");
  try {
    ImageManipulator = await import("expo-image-manipulator");
  } catch {
    throw new Error("ExpoImageManipulator native module not available");
  }

  const maxSize = params.maxSize ?? 1280;
  const compress = params.compress ?? 0.8;

  if (!Number.isFinite(maxSize) || maxSize <= 0) {
    throw new Error("maxSize must be a positive number");
  }
  if (!Number.isFinite(compress) || compress < 0 || compress > 1) {
    throw new Error("compress must be between 0 and 1");
  }

  let width: number | null = null;
  let height: number | null = null;

  try {
    const size = await getImageSize(params.uri);
    width = size.width;
    height = size.height;
  } catch {}

  const longSide =
    width != null && height != null ? Math.max(width, height) : null;
  const shouldResize = longSide == null ? true : longSide > maxSize;
  const resizeAction = !shouldResize
    ? []
    : width != null && height != null && height > width
      ? [{ resize: { height: maxSize } }]
      : [{ resize: { width: maxSize } }];

  const result = await ImageManipulator.manipulateAsync(
    params.uri,
    resizeAction,
    {
      compress,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  return {
    uri: result.uri,
    fileName: `image_${Date.now()}.jpg`,
    mimeType: "image/jpeg",
  };
}
