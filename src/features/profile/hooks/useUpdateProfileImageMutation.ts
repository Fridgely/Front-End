import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { tokenStorage } from "@/shared/lib/tokenStorage/tokenStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { clearSavedProfileImage } from "../utils/getRandomDefaultProfileImage";

type ProfileImageUploadInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

const getMimeType = (fileName: string, mimeType?: string | null) => {
  if (mimeType && mimeType.length > 0) {
    return mimeType;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "png") return "image/png";
  if (extension === "gif") return "image/gif";
  if (extension === "webp") return "image/webp";

  return "image/jpeg";
};

const useUpdateProfileImageMutation = (loginId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, any, FormData>({
    mutationFn: async (formData: FormData) => {
      const accessToken = await tokenStorage.getAccessToken();
      const baseURL =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
      const url = `${baseURL}/api/v1/members/me/profile-image`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) {
        let errorData: any = null;

        try {
          errorData = await response.json();
        } catch {
          errorData = null;
        }

        throw {
          response: {
            status: response.status,
            data: errorData,
          },
        };
      }
    },
    onSuccess: async (_data, _variables, _onMutateResult, _context) => {
      if (loginId !== "anonymous") {
        await clearSavedProfileImage(loginId);
      }

      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.member.me(),
      });

      Toast.show({
        type: "success",
        text1: "프로필 사진 수정 완료",
        text2: "프로필 사진이 변경되었습니다.",
      });
    },
    onError: (error: any, _variables, _onMutateResult, _context) => {
      const serverMessage = error.response?.data?.error?.message;

      Toast.show({
        type: "error",
        text1: "프로필 사진 수정 실패",
        text2: serverMessage || "프로필 사진 업로드 중 오류가 발생했습니다.",
      });
    },
  });

  const updateProfileImage = ({
    uri,
    fileName: inputFileName,
    mimeType,
  }: ProfileImageUploadInput) => {
    const fileName =
      inputFileName || uri.split("/").pop() || `profile_${Date.now()}.jpg`;
    const type = getMimeType(fileName, mimeType);

    const formData = new FormData();
    formData.append("file", {
      uri,
      type,
      name: fileName,
    } as any);

    mutation.mutate(formData);
  };

  return { ...mutation, mutate: updateProfileImage };
};

export { useUpdateProfileImageMutation };
