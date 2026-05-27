interface LoginRequest {
  loginId: string;
  password: string;
}

interface SignupRequest {
  loginId: string;
  password: string;
  nickname: string;
}

interface LoginResponse {
  result: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export { LoginRequest, LoginResponse, SignupRequest };
