interface MemberProfileData {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
}

interface MemberProfileResponse {
  result: string;
  data: MemberProfileData;
}

export type { MemberProfileData, MemberProfileResponse };
