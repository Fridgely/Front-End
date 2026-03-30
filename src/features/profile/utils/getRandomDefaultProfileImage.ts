import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageSourcePropType } from "react-native";

const DEFAULT_PROFILE_IMAGES: ImageSourcePropType[] = [
  require("../../../../assets/images/profile_apple.png"),
  require("../../../../assets/images/profile_carrot.png"),
  require("../../../../assets/images/profile_milk.png"),
  require("../../../../assets/images/profile_fridge.png"),
];

const PROFILE_IMAGE_STORAGE_KEY = "default_profile_image";

// 랜덤으로 기본 프로필 이미지 하나를 반환하는 함수
const getRandomDefaultProfileImage = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_PROFILE_IMAGES.length);
  return DEFAULT_PROFILE_IMAGES[randomIndex];
};

// 저장된 프로필 이미지가 없을시 asyncStorage에서 인덱스를 불러와서 사진 반환
const getSavedProfileImageIndex = async (): Promise<number | null> => {
  try {
    const saved = await AsyncStorage.getItem(PROFILE_IMAGE_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : null;
  } catch (error) {
    console.error("프로필 이미지 인덱스 로드 실패:", error);
    return null;
  }
};

// 기본 프로필 이미지 인덱스를 storage에  저장
const saveProfileImageIndex = async (index: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_IMAGE_STORAGE_KEY, index.toString());
  } catch (error) {
    console.error("프로필 이미지 인덱스 저장 실패:", error);
  }
};

// 저장된 기본 프로필 이미지 불러오기
const getSavedProfileImage = async (): Promise<ImageSourcePropType | null> => {
  const index = await getSavedProfileImageIndex();
  if (index !== null && index >= 0 && index < DEFAULT_PROFILE_IMAGES.length) {
    return DEFAULT_PROFILE_IMAGES[index];
  }
  return null;
};

// 사용자가 이미지를 업로드했을시 스토리지에서 기본 이미지 제거ㄴ
const clearSavedProfileImage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROFILE_IMAGE_STORAGE_KEY);
  } catch (error) {
    console.error("프로필 이미지 초기화 실패:", error);
  }
};

export {
  clearSavedProfileImage,
  DEFAULT_PROFILE_IMAGES,
  getRandomDefaultProfileImage,
  getSavedProfileImage,
  getSavedProfileImageIndex,
  saveProfileImageIndex,
};
